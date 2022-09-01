import { useAuthStore } from "~~/stores/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
	const authStore = useAuthStore();
	if (!authStore.isLoggedIn) {
		if (to.name !== "auth") {
			return navigateTo("/auth");
		}
	} else if (to.hash.includes("recovery")) {
		authStore.setResettingPassword(true);
	} else if (authStore.isLoggedIn && to.name === "auth") {
		return navigateTo("/");
	}
});
