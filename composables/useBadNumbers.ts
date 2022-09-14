import { useAuthStore } from "~~/stores/auth";
import { TwilioCSV } from "~~/types/types";

interface BadNumber {
	number: string;
	user_id: string;
}

export default async function useFormattedLeads(data: TwilioCSV[]) {
	const duplicates = [] as string[];
	const badNumbers = [] as BadNumber[];

	// filter out the duplicates

	const authStore = useAuthStore();
	console.log(data);
	data.forEach((item) => {
		if (item.From !== "+17274968795" && !duplicates.includes(item.From)) {
			duplicates.push(item.From);
			badNumbers.push({
				number: `+${item.From}`,
				user_id: authStore.user.id,
			});
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
