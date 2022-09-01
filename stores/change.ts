import { defineStore } from "pinia";
import { ChangeToken } from "~~/types/change";

export const useChangeStore = defineStore("change", {
	state: () => ({
		change_token: null as ChangeToken,
		expires_on: null as number,
	}),
	getters: {
		isExpired(state) {
			if (state.expires_on < new Date().getTime()) {
				return true;
			} else {
				return false;
			}
		},
	},
	actions: {
		setChangeToken(token: ChangeToken) {
			this.change_token = token;
			this.expires_on = new Date().getTime() + 1000 * token.expires_in;
		},
	},
});
