import { useUiStore } from '~/stores/ui';
import { useAuthStore } from '~/stores/auth';
import { useProfileStore } from '~/stores/profile';
import { useDataStore } from '~/stores/data';

export default async function useLoadContent() {
	const uiStore = useUiStore();
	const authStore = useAuthStore();
	const profileStore = useProfileStore();
	const dataStore = useDataStore();

	uiStore.toggleAppLoading(true);
	uiStore.toggleSidebar(true);
	uiStore.setWidth();

	if (uiStore.width && uiStore.width < 440) {
		uiStore.toggleSidebar(false);
	}

	await profileStore.fetchProfile();
	await dataStore.callFetchChartData();

	authStore.initialized = true;

	console.log('content loaded');

	setTimeout(() => {
		uiStore.toggleAppLoading(false);
	}, 1000);
}
