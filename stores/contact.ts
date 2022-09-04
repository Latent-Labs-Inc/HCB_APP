import { defineStore } from "pinia";
import { Contact } from "~/types/types";

export const useContactStore = defineStore("contact", {
	state: () => ({
		contacts: [],
		contact: null,
	}),
	getters: {
		getContactById: (state) => (id) => {
			return state.contacts.find((contact) => contact.id === id);
		},
	},
	actions: {
		async fetchContacts() {
			const { $supabase } = useNuxtApp();
			try {
				const { data, error } = await $supabase.from("contacts").select("*");
				if (error) {
					throw error;
				}
				this.contacts = data;
			} catch (error) {
				console.log(error);
			}
		},
		async uploadContacts(contacts: Contact[]) {
			const { $supabase } = useNuxtApp();
			try {
				const { data, error } = await $supabase.from("contacts").insert(contacts);
				if (error) {
					throw error;
				}
				this.contacts = data;
			} catch (error) {
				console.log(error);
			}
		},
	},
});
