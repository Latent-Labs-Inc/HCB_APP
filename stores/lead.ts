import { defineStore } from "pinia";
import { Lead, Filter } from "~/types/types";
import { useAuthStore } from "./auth";

export const useLeadStore = defineStore("lead", {
	state: () => ({
		leads: [],
		leadSelected: null,
		leadType: null,
		leadProvider: null,
		lead_id: null,
	}),
	getters: {
		getLeadById: (state) => (id) => {
			return state.leads.find((lead) => lead.id === id);
		},
	},
	actions: {
		setSelectedLeadId(lead_id) {
			this.lead_id = lead_id;
		},
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
		async removeLeads(filters: Filter[]) {
			const authStore = useAuthStore();
			const { $supabase } = useNuxtApp();
			if (filters.length === 1) {
				try {
					// make it so it delete all the leads that match the filters including the marketing ones

					const { data, error } = await $supabase
						.from("leads")
						.delete()
						.filter(
							`${filters[0].field}`,
							`${filters[0].operator}`,
							`${filters[0].value}`
						);

					if (error) {
						throw error;
					}
					console.log(data);
					return data;
				} catch (error) {
					console.log(error);
				}
			} else if (filters.length === 2) {
				try {
					// make it so it delete all the leads that match the filters including the marketing ones

					const { data, error } = await $supabase
						.from("leads")
						.delete()
						.filter(
							`${filters[0].field}`,
							`${filters[0].operator}`,
							`${filters[0].value}`
						)
						.filter(
							`${filters[1].field}`,
							`${filters[1].operator}`,
							`${filters[1].value}`
						);

					if (error) {
						throw error;
					}
					console.log(data);
					return data;
				} catch (error) {
					console.log(error);
				}
			} else if (filters.length === 3) {
				try {
					// make it so it delete all the leads that match the filters including the marketing ones

					const { data, error } = await $supabase
						.from("leads")
						.delete()
						.filter(
							`${filters[0].field}`,
							`${filters[0].operator}`,
							`${filters[0].value}`
						)
						.filter(
							`${filters[1].field}`,
							`${filters[1].operator}`,
							`${filters[1].value}`
						)
						.filter(
							`${filters[2].field}`,
							`${filters[2].operator}`,
							`${filters[2].value}`
						);

					if (error) {
						throw error;
					}
					console.log(data);
					return data;
				} catch (error) {
					console.log(error);
				}
			} else if (filters.length === 4) {
				try {
					// make it so it delete all the leads that match the filters including the marketing ones

					const { data, error } = await $supabase
						.from("leads")
						.delete()
						.filter(
							`${filters[0].field}`,
							`${filters[0].operator}`,
							`${filters[0].value}`
						)
						.filter(
							`${filters[1].field}`,
							`${filters[1].operator}`,
							`${filters[1].value}`
						)
						.filter(
							`${filters[2].field}`,
							`${filters[2].operator}`,
							`${filters[2].value}`
						)
						.filter(
							`${filters[3].field}`,
							`${filters[3].operator}`,
							`${filters[3].value}`
						);

					if (error) {
						throw error;
					}
					console.log(data);
					return data;
				} catch (error) {
					console.log(error);
				}
			} else if (filters.length === 0) {
				try {
					// make it so it delete all the leads that match the filters including the marketing ones

					const { data, error } = await $supabase
						.from("leads")
						.delete()
						.eq("user_id", authStore.user_id);

					if (error) {
						throw error;
					}
					console.log(data);
					return data;
				} catch (error) {
					console.log(error);
				}
			}
		},
	},
});
