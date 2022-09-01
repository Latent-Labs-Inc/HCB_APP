import { useUiStore } from "~/stores/ui";
import { useAuthStore } from "~/stores/auth";
import { useProfileStore } from "~/stores/profile";

export default async function useLoadContent() {
	const uiStore = useUiStore();
	const authStore = useAuthStore();
	const profileStore = useProfileStore();

	if (authStore.isLoggedIn && !authStore.initialized) {
		uiStore.toggleAppLoading(true);
		uiStore.toggleSidebar(true);
		await profileStore.fetchProfile();
		setTimeout(() => {
			uiStore.toggleAppLoading(false);
		}, 1000);
	}
}
