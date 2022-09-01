import { createClient } from "@supabase/supabase-js";

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();

	const SUPABASE_URL = config.public.SUPABASE_URL;
	const SUPABASE_KEY = config.public.SUPABASE_KEY;

	const options = {
		schema: "public",
		headers: { "x-my-custom-header": "my-app-name" },
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: true,
	};

	const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, options);

	return {
		provide: {
			supabase,
		},
	};
});
