import { defineStore } from "pinia";
import { Lead } from "~/types/types";

export const useLeadStore = defineStore("lead", {
	state: () => ({
		leads: [],
		lead: null,
	}),
	getters: {
		getLeadById: (state) => (id) => {
			return state.leads.find((lead) => lead.id === id);
		},
	},
	actions: {
		async fetchLeads() {
			const { $supabase } = useNuxtApp();
			try {
				const { data, error } = await $supabase.from("leads").select("*");
				if (error) {
					throw error;
				}
				this.leads = data;
			} catch (error) {
				console.log(error);
			}
		},
		async uploadLeads(leads: Lead[]) {
			const { $supabase } = useNuxtApp();
			try {
				const { data, error } = await $supabase.from("leads").insert(leads);
				if (error) {
					throw error;
				}
				this.leads = data;
			} catch (error) {
				console.log(error);
			}
		},
	},
});
