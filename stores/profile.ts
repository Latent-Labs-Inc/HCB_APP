import { defineStore } from "pinia";
import { Profile } from "~/types/types";

export const useProfileStore = defineStore("profile", {
	state: () => ({
		profile: null as Profile,
		adminSelectedProfile: null as Profile,
	}),
	getters: {
		isAdmin(state) {
			return !!state.profile && state.profile.admin;
		},
	},
	actions: {
		async setProfile(profile: Profile) {
			this.profile = profile;
		},
		async setAdminSelectedProfile(profile: Profile) {
			await this.setProfile(profile);
			this.adminSelectedProfile = profile;
		},
		async fetchProfile(id?) {
			const { $supabase } = useNuxtApp();
			if (id) {
				try {
					const { data, error } = await $supabase
						.from("profiles")
						.select("*")
						.eq("user_id", id);
					if (error) {
						throw error;
					}
					this.setProfile(data[0]);
					return data[0];
				} catch (error) {
					console.log(error);
				}
			} else {
				try {
					const { data, error } = await $supabase.from("profiles").select("*");
					if (error) {
						throw error;
					}
					this.setProfile(data[0]);
				} catch (error) {
					console.log(error);
				}
			}
		},
		async adminSearchProfiles(input, filter?) {
			const { $supabase } = useNuxtApp();
			if (input.split(" ").length > 1) {
				let terms = input.split(" ");
				try {
					console.log(terms);
					const { data, error } = await $supabase
						.from("profiles")
						.select("*")
						.or(
							`username.in.(${terms}),email.in.(${terms}),username.like.%${terms[0]}%,email.like.%${terms[1]}%,username.like.%${terms[0]}%,email.like.%${terms[1]}%`
						)
						.neq("admin", true)
						.eq("type", filter);
					if (error) {
						throw error;
					}
					console.log(data);
					return data;
				} catch (error) {
					console.log(error);
				}
			} else {
				try {
					const { data, error } = await $supabase
						.from("profiles")
						.select("*")
						.or(`username.like.%${input}%,email.like.%${input}%`)
						.neq("admin", true)
						.eq("type", filter);
					if (error) {
						throw error;
					}
					return data;
				} catch (error) {
					console.log(error);
				}
			}
		},
		clearState() {
			this.profile = null;
			this.adminSelectedProfile = null;
		},
	},
});
