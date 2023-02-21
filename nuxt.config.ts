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
			SUPABASE_PROJECT_ID: process.env.SUPABASE_PROJECT_ID,
		},
		private: {
			TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
			TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
			TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
			SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
			SECRET: process.env.SECRET,
			EMAIL_USER: process.env.EMAIL_USER,
			EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
			EMAIL_HOST: process.env.EMAIL_HOST,
			EMAIL_PORT: process.env.EMAIL_PORT,
			EMAIL_FROM: process.env.EMAIL_FROM,
			CRON_API_KEY: process.env.CRON_API_KEY,
			CHROME_EXECUTABLE_PATH: process.env.CHROME_EXECUTABLE_PATH,
		},
	},
});
