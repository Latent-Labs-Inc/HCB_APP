import Icons from 'unplugin-icons/vite';

export default defineNuxtConfig({
	modules: [
		'@nuxtjs/tailwindcss',
		'unplugin-icons/nuxt',
		'@pinia/nuxt',
		'@nuxtjs/supabase',
	],
	css: ['@/assets/css/tailwind.css'],
	build: {
		transpile: ['chart.js'],
	},
	vite: {
		plugins: [
			Icons({
				autoInstall: true,
			}),
		],
	},
	supabase: {
		url: process.env.SUPABASE_URL,
		key: process.env.SUPABASE_KEY,
		serviceKey: process.env.SUPABASE_SERVICE_KEY,
		client: {
			auth: {
				autoRefreshToken: true,
				persistSession: true,
			},
		},
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
});
