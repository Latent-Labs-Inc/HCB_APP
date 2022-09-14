import { useAuthStore } from "~~/stores/auth";
import { TwilioCSV } from "~~/types/types";

interface BadNumber {
	number: string;
	user_id: string;
}

export default async function useFormattedLeads(data: TwilioCSV[]) {
	const badNumbers = [] as BadNumber[];

	const authStore = useAuthStore();

	data.forEach((item) => {
		if (item.From !== "+17274968795") {
			badNumbers.push({ number: item.From, user_id: authStore.user_id });
		}
	});
	try {
		const { $supabase } = useNuxtApp();
		const { data: supabaseData, error } = await $supabase
			.from("bad_numbers")
			.insert(badNumbers);
		if (error) {
			console.log(error);
		}
		console.log(supabaseData);
	} catch (error) {
		console.log(error);
	}
}
