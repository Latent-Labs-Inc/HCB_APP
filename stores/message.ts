import { defineStore } from "pinia";
import { Lead, IncomingMessage, Message } from "~/types/types";

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
					.select("*")
					.order("created_at", { ascending: false });
				if (error) {
					throw error;
				}
				this.messages = data;
				return this.messages;
			} catch (error) {
				console.log(error);
			}
		},
		async fetchConversation(phone: string) {
			try {
				console.log("fetching conversation from ", phone);
				const { $supabase } = useNuxtApp();
				const { data: received, error } = await $supabase
					.from("incoming_messages")
					.select("*")
					.eq("from", phone)
					.order("created_at", { ascending: false });
				const { data: sent, error: err } = await $supabase
					.from("sent_messages")
					.select("*")
					.eq("to", phone)
					.order("created_at", { ascending: false });
				if (error || err) {
					throw error || err;
				}
				let conversation = [...received, ...sent];
				return conversation;
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
					.like("from", `%${phone}%`);
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
