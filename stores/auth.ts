import { defineStore } from 'pinia';
import { useUiStore } from './ui';
import { User, Session } from '@supabase/gotrue-js/src/lib/types';
// figure out how to set the expires in field in the session

export const useAuthStore = defineStore('auth', () => {
	// state
	const uiStore = useUiStore();
	const router = useRouter();
	const client = useSupabaseClient<Database>();
	const { APP_URL } = useRuntimeConfig().public;

	const user = ref<User | null>(null);
	const session = ref<Session | null>(null);
	const profile = ref<Profile | null>(null);
	const authError = ref<string>('');
	const expiresIn = ref<number | null>(null);
	const initialized = ref<boolean>(false);
	const selectedProfile = ref<Profile | null>(null);

	// computed/getters
	const getUser = computed(() => {
		return user.value;
	});
	const isLoggedIn = computed(() => {
		return user.value && user.value.id !== undefined;
	});
	const isError = computed(() => {
		return authError.value !== '';
	});
	const user_id = computed((state) => {
		if (user.value) {
			return user.value.id;
		}
	});
	const getProfileType = computed(() => {
		if (profile.value) {
			return profile.value.type;
		}
	});
	const adminProfileSelected = computed(() => {
		return (
			profile.value &&
			profile.value.type === 'admin' &&
			selectedProfile.value!.user_id !== undefined
		);
	});
	const selectedProfileId = computed(() => {
		if (selectedProfile.value) return selectedProfile.value.user_id;
	});
	const isAdmin = computed(() => {
		if (profile.value) return profile.value.type === 'admin';
	});
	const getId = computed(() => {
		if (profile.value && user.value) {
			if (profile.value.type === 'admin' && selectedProfile.value) {
				return selectedProfile.value.user_id;
			} else {
				return user.value.id;
			}
		} else {
			return '';
		}
	});

	// actions
	const setError = (error: string) => {
		authError.value = error;
	};
	const signUp = async (userData: {
		email: string;
		password: string;
		options?: {
			data: { name: string; type: string; phone: string };
		};
	}) => {
		try {
			const { error } = await client.auth.signUp(userData);
			if (error) {
				throw error;
			}
			router.push('/');
			uiStore.showAlert(
				'User Created Successfully, Check Email for Confirmation',
				'success'
			);
			return { error };
		} catch (e: any) {
			authError.value = e.message;
			console.log('error', e);
		}
	};
	const getProfile = async () => {
		if (!user.value) return;
		try {
			const { data, error } = await client
				.from('profiles')
				.select('*')
				.eq('user_id', user.value.id)
				.single();
			if (error) {
				throw error;
			}
			profile.value = data;
			return data;
		} catch (e: any) {
			authError.value = e.message;
		}
	};
	const signIn = async ({
		email,
		password,
	}: {
		email: string;
		password: string;
	}) => {
		try {
			const { data, error } = await client.auth.signInWithPassword({
				email,
				password,
			});
			if (error) {
				throw error;
			}
			if (data.user && data.session) {
				session.value = data.session;
				user.value = data.user;
				initialized.value = true;
				expiresIn.value = data.session.expires_in;
				setTimer();
				await getProfile();
				await useLoadContent();
			}
			router.push('/');
		} catch (e: any) {
			authError.value = e.message;
		}
	};
	const signOut = async () => {
		const PROJECT_ID = useRuntimeConfig().public.PROJECT_ID;
		try {
			const { error } = await client.auth.signOut();
			console.log('signed out');
			if (error) {
				throw error;
			}
			session.value = null;
			user.value = null;
			profile.value = null;
			expiresIn.value = null;
			localStorage.removeItem(`sb-${PROJECT_ID}-auth-token`);
			router.push('/auth');
			uiStore.toggleSidebar(false);
			initialized.value = false;
		} catch (e: any) {
			authError.value = e.message;
		}
	};
	const checkRefresh = async () => {
		const PROJECT_ID = useRuntimeConfig().public.SUPABASE_PROJECT_ID;
		try {
			const supabaseAuthToken: {
				currentSession: {
					access_token: string;
					expires_in: number;
					refresh_token: string;
					token_type: string;
					user: User;
				};
			} = JSON.parse(localStorage.getItem(`sb-${PROJECT_ID}-auth-token`)!);
			if (supabaseAuthToken !== null) {
				const { data, error } = await client.auth.getSession();
				if (error) throw error;
				if (data.session !== null) {
					session.value = data.session;
					user.value = data.session.user;
					expiresIn.value = data.session.expires_in;
					setTimer();
					await getProfile();
				}
				router.push('/');
			}
		} catch (e: any) {
			console.log('error', e);
		}
	};
	const updateUser = async (password: string) => {
		try {
			const { data, error } = await client.auth.updateUser({
				password: password,
			});
			if (error) {
				throw error;
			}
			user.value = data.user;
			return { error };
		} catch (error) {
			console.log(error);
			return { error };
		}
	};
	const sendPasswordReset = async (email: string) => {
		try {
			const { error } = await client.auth.resetPasswordForEmail(email, {
				redirectTo: `${APP_URL}/settings/reset-password`,
			});
			if (error) {
				throw error;
			}
			return { error };
		} catch (error) {
			console.log(error);
			return { error };
		}
	};
	const useResetHash = async (hash: string) => {
		let params = hash.split('&');
		let access_token = params[0].split('=')[1];
		let refresh_token = params[2].split('=')[1];
		try {
			const { data, error } = await client.auth.setSession({
				access_token,
				refresh_token,
			});
			if (error) {
				throw error;
			}
			session.value = data.session;
			user.value = data.user;
			router.push('/settings/reset-password');
			return { error };
		} catch (error) {
			console.log(error);
			return { error };
		}
	};
	const setSelectedProfile = async (profile: Profile) => {
		if (!user.value) return;
		uiStore.toggleFunctionLoading(true);
		try {
			// want to use the users_id get the user from the profile table and see if the user is an admin
			const { data, error } = await client
				.from('profiles')
				.select('*')
				.eq('user_id', user.value.id)
				.eq('type', 'admin');
			if (error) {
				throw error;
			}
			if (data[0].user_id === user.value.id) {
				selectedProfile.value = profile;
				setTimeout(() => {
					uiStore.toggleFunctionLoading(false);
					router.push('/');
					// uiStore.showAlert(`Profile Selected: ${profile.name}`, 'success');
				}, 1200);
			}
		} catch (error) {
			console.log(error);
			uiStore.toggleFunctionLoading(false);
			// uiStore.showAlert(error as string, 'error');
		}
	};
	const refreshSession = async () => {
		try {
			const { data, error } = await client.auth.refreshSession();
			if (error) {
				throw error;
			}
			if (data.session !== null) {
				session.value = data.session;
				expiresIn.value = data.session.expires_in;
				setTimer();
				return { error };
			}
		} catch (error) {
			console.log(error);
			return { error };
		}
	};
	const setTimer = () => {
		setTimeout(async () => {
			console.log('refreshing session');
			await refreshSession();
		}, expiresIn.value! * 1000);
	};
	const clearState = () => {
		user.value = null;
		session.value = null;
		setError('');
		authError.value = '';
		expiresIn.value = null;
		initialized.value = false;
	};

	return {
		user,
		session,
		expiresIn,
		initialized,
		authError,
		selectedProfile,
		getUser,
		isLoggedIn,
		isError,
		user_id,
		getProfileType,
		adminProfileSelected,
		selectedProfileId,
		isAdmin,
		getId,
		signUp,
		signIn,
		signOut,
		checkRefresh,
		updateUser,
		sendPasswordReset,
		useResetHash,
		setSelectedProfile,
		refreshSession,
		clearState,
	};
});
