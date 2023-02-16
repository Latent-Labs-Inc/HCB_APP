import { defineStore } from 'pinia';
// figure out how to typescript this

export const useUiStore = defineStore('ui', () => {
	const sidebar = ref(false);
	const theme = ref<'light' | 'dark'>('light');
	const appLoading = ref(false);
	const functionLoading = ref(false);
	const initialLoading = ref(true);
	const mobileUser = ref(false);
	const width = ref<number | null>(null);
	const progressBar = reactive({
		max: 0,
		value: 0,
		show: false,
		label: '',
	});

	const setWidth = () => {
		width.value =
			window.innerWidth ||
			document.documentElement.clientWidth ||
			document.body.clientWidth;
	};

	const setTheme = (newTheme: 'dark' | 'light') => {
		document.documentElement.classList.add(newTheme);
		localStorage.theme = theme;
		theme.value = newTheme;
	};
	const toggleTheme = () => {
		if (theme.value === 'dark') {
			document.documentElement.classList.remove('dark');
			localStorage.theme = 'light';
			theme.value = 'light';
		} else if (theme.value === 'light') {
			document.documentElement.classList.add('dark');
			localStorage.theme = 'dark';
			theme.value = 'dark';
		}
	};
	const toggleSidebar = (show?: boolean) => {
		if (show === undefined) {
			sidebar.value = !sidebar.value;
		} else {
			sidebar.value = show;
		}
	};
	const toggleAppLoading = (loading: boolean) => {
		appLoading.value = loading;
	};
	const toggleFunctionLoading = (loading: boolean) => {
		functionLoading.value = loading;
	};
	const setProgressBar = (updatedBar: {
		max: number;
		value: number;
		show: boolean;
		label: string;
	}) => {
		progressBar.max = updatedBar.max;
		progressBar.value = updatedBar.value;
		progressBar.show = updatedBar.show;
		progressBar.label = updatedBar.label;
	};

	const clearProgressBar = () => {
		progressBar.max = 0;
		progressBar.value = 0;
		progressBar.show = false;
		progressBar.label = '';
	};

	return {
		sidebar,
		theme,
		appLoading,
		functionLoading,
		initialLoading,
		mobileUser,
		width,
		progressBar,
		setWidth,
		setTheme,
		toggleTheme,
		toggleSidebar,
		toggleAppLoading,
		toggleFunctionLoading,
		setProgressBar,
		clearProgressBar,
	};
});
