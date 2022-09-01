import { defineStore } from "pinia";
// figure out how to typescript this

export const useUiStore = defineStore("ui", {
	state: () => ({
		sidebar: false,
		theme: "light",
		appLoading: false,
		functionLoading: false,
		initialLoading: false,
	}),
	getters: {},
	actions: {
		setTheme(theme: string) {
			document.documentElement.classList.add(theme);
			localStorage.theme = theme;
			this.theme = theme;
		},
		toggleTheme() {
			if (this.theme === "dark") {
				document.documentElement.classList.remove("dark");
				localStorage.theme = "light";
				this.theme = "light";
			} else if (this.theme === "light") {
				document.documentElement.classList.add("dark");
				localStorage.theme = "dark";
				this.theme = "dark";
			}
		},
		toggleSidebar(show?: boolean) {
			if (show === undefined) {
				this.sidebar = !this.sidebar;
			} else {
				this.sidebar = show;
			}
		},
		toggleAppLoading(loading: boolean) {
			this.appLoading = loading;
		},
		toggleFunctionLoading(loading: boolean) {
			this.functionLoading = loading;
		},
	},
});
