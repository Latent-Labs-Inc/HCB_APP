import { defineNuxtConfig } from "nuxt";
import Icons from "unplugin-icons/vite";

export default defineNuxtConfig({
	head: {
		link: [
			// { rel: "icon", type: "image/png", href: "/favicon.png" },
			{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
		],
	},
	css: ["@/assets/css/tailwind.css"],

	build: {
		transpile: ["chart.js"],
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
			TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
			TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
			TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
			SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
		},
	},
	buildModules: [["@nuxtjs/tailwindcss", { config: "@/tailwind.config.js" }]],
	modules: ["@nuxtjs/tailwindcss", "unplugin-icons/nuxt", "@pinia/nuxt"],
});
