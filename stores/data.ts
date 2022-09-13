import { defineStore } from "pinia";
import { useUiStore } from "./ui";

export const useDataStore = defineStore("data", {
	state: () => ({
		fiverrLeads: null as number,
		fiverrTexted: null as number,
		foreclosureDailyLeads: null as number,
		foreclosureDailyTexted: null as number,
		propStreamLeads: null as number,
		propStreamTexted: null as number,
		otherLeads: null as number,
		otherTexted: null as number,
		uiStore: useUiStore(),
		calledDataFetch: false as boolean,
	}),
	getters: {
		async textedChartData(state) {
			if (!state.calledDataFetch) {
				await this.callFetchChartData();
			}

			const color =
				state.uiStore.theme === "light"
					? "rgba(26, 106, 26, .9)"
					: "rgba(2, 173, 36, 0.9)";

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
						backgroundColor: [`${color}`, `${color}`, `${color}`, `${color}`],
					},
				],
			};

			return chartData;
		},
		async leadChartData(state) {
			if (!state.calledDataFetch) {
				await this.callChartLeadData();
			}

			const color =
				state.uiStore.theme === "light"
					? "rgba(26, 106, 26, .9)"
					: "rgba(2, 173, 36, 0.9)";

			const chartData = {
				labels: ["Fiverr", "ForeclosureDaily", "PropStream", "Other"],
				datasets: [
					{
						label: "Total Leads by Provider",
						data: [
							state.fiverrLeads,
							state.foreclosureDailyLeads,
							state.propStreamLeads,
							state.otherLeads,
						],
						backgroundColor: [`${color}`, `${color}`, `${color}`, `${color}`],
					},
				],
			};

			return chartData;
		},
	},
	actions: {
		async callFetchChartData() {
			await this.fetchLeadData();
			await this.fetchTextedData();
			this.calledDataFetch = true;
		},
		async fetchLeadData() {
			const { $supabase } = useNuxtApp();
			try {
				const { data, error } = await $supabase.rpc("get_chart_data");
				this.fiverrLeads = data[0];
				this.propStreamLeads = data[1];
				this.foreclosureDailyLeads = data[2];
				this.otherLeads = data[3];
			} catch (error) {
				console.log(error);
			}
		},
		async fetchTextedData() {
			const { $supabase } = useNuxtApp();
			try {
				const { data, error } = await $supabase.rpc("get_chart_data_texted");
				this.fiverrTexted = data[0];
				this.propStreamTexted = data[1];
				this.foreclosureDailyTexted = data[2];
				this.otherTexted = data[3];
				console.log(data);
			} catch (error) {
				console.log(error);
			}
		},
	},
});
