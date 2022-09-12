import { defineStore } from "pinia";
import { Lead, Filter } from "~/types/types";

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
		async removeLeads(filters: Filter[]) {
			const { $supabase } = useNuxtApp();
			try {
				// make it so it delete all the leads that match the filters including the marketing ones

				const filterConstructor = (filters) => {
					console.log(filters);
					let filterString = "";
					filters.forEach((filter: Filter, index) => {
						if (index === 0) {
							filterString += `${filter.field}.${filter.operator}.${filter.value}`;
						} else {
							filterString += `and(${filter.field}.${filter.operator}.${filter.value})`;
						}
					});
					return filterString;
				};

				let filterString = !!filterConstructor(filters)
					? filterConstructor(filters)
					: "";

				let data;
				let error;
				if (!!filterString) {
					const { data1, error1 } = await $supabase
						.from("leads")
						.delete()
						.or(filterString);
					data = data1;
					error = error1;
				} else {
					const { data1, error1 } = await $supabase.from("leads").delete();
					data = data1;
					error = error1;
				}

				if (error) {
					throw error;
				}
				console.log(data);
				return data;
			} catch (error) {
				console.log(error);
			}
		},
	},
});
