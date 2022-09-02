import { useAuthStore } from "~~/stores/auth";
import { useProfileStore } from "~~/stores/profile";

export default async function useClearState() {
	const authStore = useAuthStore();
	const profileStore = useProfileStore();

	await authStore.clearState();
	await profileStore.clearState();
}
