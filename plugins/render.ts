import { useAuthStore } from "~/stores/auth";
import { useUiStore } from "~~/stores/ui";

export default defineNuxtPlugin(async (nuxtApp) => {
	nuxtApp.hook("page:start", async () => {
		console.log("page:start");
		const uiStore = useUiStore();
		const authStore = useAuthStore();
		if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			uiStore.setTheme("dark");
			document.body.classList.add("dark:bg-black");
		} else {
			uiStore.setTheme("light");
			document.body.classList.remove("dark:bg-black");
		}

		if (authStore.isLoggedIn && !authStore.initialized) {
			await useLoadContent();
			authStore.initialized = true;
		}
	});
});
