export default async function useChartDataMarketed() {
	const { $supabase } = useNuxtApp();

	const { data: fiverrMarketed } = await $supabase
		.from("leads")
		.select("*")
		.eq("texted", true)
		.eq("leadProvider", "fiverr");

	const { data: propStreamMarketed } = await $supabase
		.from("leads")
		.select("*")
		.eq("texted", true)
		.eq("leadProvider", "propStream");

	const { data: foreclosureDailyMarketed } = await $supabase
		.from("leads")
		.select("*")
		.eq("texted", true)
		.eq("leadProvider", "foreclosureDaily");

	const { data: otherMarketed } = await $supabase
		.from("leads")
		.select("*")
		.eq("texted", true)
		.eq("leadProvider", "other");

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
	};

	const chartData = {
		labels: ["Fiverr", "ForeclosureDaily", "PropStream", "Other"],
		datasets: [
			{
				label: "Total Leads Marketed",
				data: [
					fiverrMarketed?.length,
					foreclosureDailyMarketed?.length,
					propStreamMarketed?.length,
					otherMarketed?.length,
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
	const datasetIdKey = "LeadsMarketed";

	return {
		chartData,
		chartOptions,
		datasetIdKey,
	};
}
