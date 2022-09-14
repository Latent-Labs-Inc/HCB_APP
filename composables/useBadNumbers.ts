import { Lead } from "~/types/types";
import { useAuthStore } from "~~/stores/auth";
import { useLeadStore } from "~~/stores/lead";

interface BadNumber {
	number: string;
	user_id: string;
}

export default async function useFormattedLeads(data: any[]) {
	const badNumbers = [] as BadNumber[];

	const authStore = useAuthStore();

	console.log(data);
}
