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
				const { data, error } = await $supabase.from("leads").select("*");
				if (error) {
					throw error;
				}
				const fiverrLeads = data.filter((lead) => lead.leadProvider === "fiverr");
				const foreclosureDailyLeads = data.filter(
					(lead) => lead.leadProvider === "foreclosureDaily"
				);
				const propStreamLeads = data.filter(
					(lead) => lead.leadProvider === "propStream"
				);
				const otherLeads = data.filter((lead) => lead.leadProvider === "other");
				this.fiverrLeads = fiverrLeads.length;
				this.foreclosureDailyLeads = foreclosureDailyLeads.length;
				this.propStreamLeads = propStreamLeads.length;
				this.otherLeads = otherLeads.length;
			} catch (error) {
				console.log(error);
			}
		},
		async fetchTextedData() {
			const { $supabase } = useNuxtApp();
			try {
				const { data, error } = await $supabase
					.from("leads")
					.select("*")
					.eq("texted", true);
				if (error) {
					throw error;
				}
				const fiverrLeads = data.filter((lead) => lead.leadProvider === "fiverr");
				const foreclosureDailyLeads = data.filter(
					(lead) => lead.leadProvider === "foreclosureDaily"
				);
				const propStreamLeads = data.filter(
					(lead) => lead.leadProvider === "propStream"
				);
				const otherLeads = data.filter((lead) => lead.leadProvider === "other");
				this.fiverrTexted = fiverrLeads.length;
				this.foreclosureDailyTexted = foreclosureDailyLeads.length;
				this.propStreamTexted = propStreamLeads.length;
				this.otherTexted = otherLeads.length;
			} catch (error) {
				console.log(error);
			}
		},
	},
});
