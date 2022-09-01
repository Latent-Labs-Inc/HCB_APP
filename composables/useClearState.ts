import { useAuthStore } from "~~/stores/auth";
import { useProfileStore } from "~~/stores/profile";
import { usePatientStore } from "~~/stores/patients";

export default async function useClearState() {
	const authStore = useAuthStore();
	const profileStore = useProfileStore();
	const patientStore = usePatientStore();

	await authStore.clearState();
	await profileStore.clearState();
	await patientStore.clearState();
}
