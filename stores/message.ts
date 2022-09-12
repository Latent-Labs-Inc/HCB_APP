import { defineStore } from "pinia";
import { Lead, IncomingMessage } from "~/types/types";

export const useMessageStore = defineStore("message", {
	state: () => ({
		messages: [] as IncomingMessage[],
		selectedMessage: null as IncomingMessage | null,
	}),
	getters: {
		getMessagesByLeadId: (state) => (id) => {
			return state.messages.filter((message) => message.lead_id === id);
		},
	},
	actions: {
		async fetchMessages() {
			const { $supabase } = useNuxtApp();
			try {
				const { data, error } = await $supabase
					.from("incoming_messages")
					.select("*");
				if (error) {
					throw error;
				}
				this.messages = data;
				return this.messages;
			} catch (error) {
				console.log(error);
			}
		},
		async fetchByPhone(phone: string) {
			const { $supabase } = useNuxtApp();
			try {
				const { data, error } = await $supabase
					.from("incoming_messages")
					.select("*")
					.contains("wireless", [phone]);
				if (error) {
					throw error;
				}
				this.messages = data;
				return this.messages;
			} catch (error) {
				console.log(error);
			}
		},
	},
});
