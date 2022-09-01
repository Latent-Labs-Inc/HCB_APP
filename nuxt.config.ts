import { defineNuxtConfig } from "nuxt";
import Icons from "unplugin-icons/vite";

export default defineNuxtConfig({
	head: {
		link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
	},
	css: ["@/assets/css/tailwind.css"],
	build: {
		postcss: {
			postcssOptions: {
				plugins: {
					tailwindcss: {},
					autoprefixer: {},
				},
			},
		},
	},
	vite: {
		plugins: [
			Icons({
				autoInstall: true,
			}),
		],
	},
	pageTransition: {
		name: "fade",
		mode: "out-in",
	},
	layoutTransition: {
		name: "fade",
		mode: "out-in",
	},
	runtimeConfig: {
		// The private keys which are only available within server-side
		public: {
			SUPABASE_URL: process.env.SUPABASE_URL,
			SUPABASE_KEY: process.env.SUPABASE_KEY,
		},
		private: {
			CHANGE_CLIENT_ID: process.env.CHANGE_CLIENT_ID,
			CHANGE_CLIENT_SECRET: process.env.CHANGE_CLIENT_SECRET,
			SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
		},
	},
	buildModules: [
		["@pinia/nuxt", { disableVuex: true }],
		["@nuxtjs/tailwindcss", { config: "@/tailwind.config.js" }],
	],
	modules: ["@nuxtjs/tailwindcss", "unplugin-icons/nuxt"],
});
