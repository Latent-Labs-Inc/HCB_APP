import { useAuthStore } from '~/stores/auth';
import { useUiStore } from '~~/stores/ui';

export default defineNuxtPlugin(async (nuxtApp) => {
	nuxtApp.hook('app:mounted', async () => {
		const uiStore = useUiStore();
		const authStore = useAuthStore();
		uiStore.toggleAppLoading(true);
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			uiStore.setTheme('dark');
			document.body.classList.add('dark:bg-black');
		} else {
			uiStore.setTheme('light');
			document.body.classList.remove('dark:bg-black');
		}

		await authStore.checkRefresh();

		if (authStore.isLoggedIn && !authStore.initialized) {
			await useLoadContent();
		}

		setTimeout(() => {
			uiStore.toggleAppLoading(false);
		}, 1000);
	});
});
