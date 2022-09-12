import { useDataStore } from "~/stores/data";

export default async function useChartDataMarketed() {
	const { $supabase } = useNuxtApp();
	const dataStore = useDataStore();

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
	};

	const chartData = await dataStore.leadChartData;

	const datasetIdKey = "LeadsTotal";

	return {
		chartData,
		chartOptions,
		datasetIdKey,
	};
}
