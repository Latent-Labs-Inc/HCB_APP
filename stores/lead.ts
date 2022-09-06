import { defineStore } from "pinia";
import { Lead } from "~/types/types";

export const useLeadStore = defineStore("lead", {
	state: () => ({
		leads: [],
		leadSelected: null,
		leadType: null,
		leadProvider: null,
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
		async setLeadProvider(provider) {
			this.leadProvider = provider;
		},
		async setLeadType(type) {
			this.leadType = type;
		},
		async uploadLeads(leads: Lead[]) {
			const { $supabase } = useNuxtApp();
			try {
				const { data, error } = await $supabase.from("leads").insert(leads);
				if (error) {
					throw error;
				}
			} catch (error) {
				console.log(error);
			}
		},
		async fetchLeadById(id: string) {
			const { $supabase } = useNuxtApp();
			try {
				const { data, error } = await $supabase
					.from("leads")
					.select("*")
					.eq("lead_id", id);
				if (error) {
					throw error;
				}
				this.leadSelected = data[0];
				return data[0];
			} catch (error) {
				console.log(error);
			}
		},
	},
});
