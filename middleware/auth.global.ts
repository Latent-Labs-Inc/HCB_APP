import { useAuthStore } from '~~/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
	const authStore = useAuthStore();
	const profileType = authStore.getProfileType;
	if (!authStore.isLoggedIn) {
		if (to.hash) {
			const hash = to.hash.replace('#', '');
			authStore.useResetHash(hash);
		} else if (to.name !== 'auth') {
			console.log('not logged in');
			return navigateTo('/auth');
		}
	} else if (authStore.isLoggedIn && to.name === 'auth') {
		return navigateTo('/');
	}
	if (to.fullPath === '/settings/create-user' && !authStore.isAdmin) {
		return navigateTo('/');
	}
	// based on the profile type, check if the route is allowed
	if (profileType === 'admin') {
		if (adminRoutes.includes('all')) {
			return;
		} else {
			if (!adminRoutes.includes(to.name ? (to.name as string) : '')) {
				return navigateTo('/');
			}
		}
	} else if (profileType === 'sales_rep') {
		if (salesRoutes.includes('all')) {
			return;
		} else {
			if (!salesRoutes.includes(to.name ? (to.name as string) : '')) {
				return navigateTo('/');
			}
		}
	} else if (profileType === 'user') {
		if (userRoutes.includes('all')) {
			if (to.name === 'settings/create-user' || to.name === 'customers') {
				return navigateTo('/');
			}
			return;
		} else {
			if (!userRoutes.includes(to.name ? (to.name as string) : '')) {
				return navigateTo('/');
			}
		}
	}
});

const adminRoutes = ['all'];
const userRoutes = ['all'];
const salesRoutes = [
	'index',
	'auth',
	'help',
	'settings',
	'contact',
	'formulary',
];
const forbiddenRoutes = ['settings/create-user'];
