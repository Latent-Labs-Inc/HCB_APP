import { defineStore } from "pinia";

export const useLeadStore = defineStore("data", {
	state: () => ({
		fiverrLeads: null as number,
		fiverrTexted: null as number,
		foreclosureDailyLeads: null as number,
		foreclosureDailyTexted: null as number,
		propStreamLeads: null as number,
		propStreamTexted: null as number,
		otherLeads: null as number,
		otherTexted: null as number,
	}),
	getters: {
		textedChartData(state) {
			const chartData = {
				labels: ["Fiverr", "ForeclosureDaily", "PropStream", "Other"],
				datasets: [
					{
						label: "Total Leads Texted",
						data: [
							state.fiverrTexted,
							state.foreclosureDailyTexted,
							state.propStreamTexted,
							state.otherTexted,
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
			return chartData;
		},
	},
});
