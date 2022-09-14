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
		item.From = "+" + item.From;
		item.To = "+" + item.To;
	});

	// get the bad numbers from the database
	const { $supabase } = useNuxtApp();
	const { data: badNumbersData, error: badNumbersError } = await $supabase
		.from("bad_numbers")
		.select("*");

	console.log(badNumbersData);

	data.forEach((item) => {
		if (
			item.From !== "+17274968795" &&
			!duplicates.includes(item.From) &&
			badNumbersData.filter((badNumber) => badNumber.number === item.From)
				.length === 0
		) {
			duplicates.push(item.From);
			badNumbers.push({
				number: item.From,
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
	} catch (error) {
		console.log(error);
	}
}
