export default async function useChartDataMarketed() {
	const { $supabase } = useNuxtApp();

	const { data: fiverrLeads } = await $supabase
		.from("leads")
		.select("*")
		.eq("leadType", "fiverr");

	const { data: propStreamLeads } = await $supabase
		.from("leads")
		.select("*")
		.eq("leadType", "propStream");

	const { data: foreclosureDailyLeads } = await $supabase
		.from("leads")
		.select("*")
		.eq("leadType", "foreclosureDaily");

	const { data: otherLeads } = await $supabase
		.from("leads")
		.select("*")
		.eq("leadType", "other");

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
	};

	const chartData = {
		labels: ["Fiverr", "ForeclosureDaily", "PropStream", "Other"],
		datasets: [
			{
				label: "Total Leads",
				data: [
					fiverrLeads?.length,
					foreclosureDailyLeads?.length,
					propStreamLeads?.length,
					otherLeads?.length,
				],
				backgroundColor: [
					"rgba(2, 173, 36, .9)",
					"rgba(2, 173, 36, 0.9)",
					"rgba(2, 173, 36, 0.9)",
					"rgba(2, 173, 36, 0.9)",
				],
			},
		],
	};

	const datasetIdKey = "LeadsTotal";

	return {
		chartData,
		chartOptions,
		datasetIdKey,
	};
}
