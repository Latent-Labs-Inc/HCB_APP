import { defineStore } from "pinia";
import { Practice, Profile, SalesRep } from "~/types/types";

export const useProfileStore = defineStore("profile", {
	state: () => ({
		profile: null as Profile,
		adminSelectedProfile: null as Profile,
		practice: null as Practice,
		salesRep: null as SalesRep,
	}),
	getters: {
		isAdmin(state) {
			return !!state.profile && state.profile.admin;
		},
		isPractice(state) {
			return !!state.profile.practice_id;
		},
		isRep(state) {
			return !!state.profile.rep_id;
		},
	},
	actions: {
		async setProfile(profile: Profile) {
			this.profile = profile;
			if (profile?.type === "salesRep") {
				await this.setSalesRep(profile.rep_id);
			} else if (profile?.type === "practice") {
				await this.setPractice(profile.practice_id);
			}
		},
		async setPractice(id) {
			try {
				const { $supabase } = useNuxtApp();
				const { data, error } = await $supabase
					.from("practices")
					.select("*")
					.eq("user_id", id);
				if (error) {
					throw error;
				}
				this.practice = data[0];
				return data[0];
			} catch (error) {
				console.log(error);
			}
		},
		async setSalesRep(id) {
			try {
				const { $supabase } = useNuxtApp();
				const { data, error } = await $supabase
					.from("sales_reps")
					.select("*")
					.eq("user_id", id);
				if (error) {
					throw error;
				}
				this.salesRep = data[0];
				return data[0];
			} catch (error) {
				console.log(error);
			}
		},
		async getChildReps(ids: string[]) {
			try {
				const { $supabase } = useNuxtApp();
				const { data, error } = await $supabase
					.from("sales_reps")
					.select("*")
					.in("rep_id", ids);
				if (error) {
					throw error;
				}
				return data;
			} catch (error) {
				console.log(error);
			}
		},
		async getParentRep(id: string) {
			try {
				const { $supabase } = useNuxtApp();
				const { data, error } = await $supabase
					.from("sales_reps")
					.select("*")
					.eq("user_id", id);
				if (error) {
					throw error;
				}
				return data[0];
			} catch (error) {
				console.log(error);
			}
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
		async adminAddSalesRep(salesRep: SalesRep) {
			const { $supabase } = useNuxtApp();
			try {
				const { data, error } = await $supabase
					.from("sales_reps")
					.select("*")
					.eq("user_id", salesRep.user_id);
				if (error) {
					throw error;
				}
				if (data.length === 0) {
					const { error } = await $supabase.from("sales_reps").insert(salesRep);
					if (error) {
						throw error;
					}
				} else {
					const { error } = await $supabase
						.from("sales_reps")
						.update(salesRep)
						.match({ user_id: salesRep.user_id });
					if (error) {
						throw error;
					}
				}
			} catch (e) {
				console.log(e);
			}
		},
		async adminAddChildRep(parent_id: string, child_id: string) {
			const { $supabase } = useNuxtApp();
			try {
				const { data, error } = await $supabase
					.from("sales_reps")
					.select("children[]")
					.eq("user_id", parent_id);

				let oldChildren = data[0].children;

				let newChildren;

				if (oldChildren?.length > 0) {
					// filter out the new child_id if it is already in the array
					newChildren = oldChildren.filter((child) => child !== child_id);
					newChildren.push(child_id);
				} else {
					newChildren = [child_id];
				}

				try {
					const { data, error } = await $supabase
						.from("sales_reps")
						.update({ children: newChildren })
						.eq("user_id", parent_id);
				} catch (error) {
					console.log(error);
				}
				if (error) {
					throw error;
				}
				// this.setAdminSelectedProfile(data[0]);
				// this.profile = data[0];
			} catch (e) {
				console.log(e);
			}
		},
		async adminAddPractice(practice: Practice) {
			const { $supabase } = useNuxtApp();
			try {
				const { data, error } = await $supabase
					.from("practices")
					.select("*")
					.eq("user_id", practice.user_id);
				if (error) {
					throw error;
				}
				if (data.length === 0) {
					const { error } = await $supabase.from("practices").insert(practice);
					if (error) {
						throw error;
					}
				} else {
					practice.modified_at = new Date();
					practice.created_at = data[0].created_at;
					const { error } = await $supabase.from("practices").upsert(practice);
					if (error) {
						throw error;
					}
				}
			} catch (e) {
				console.log(e);
			}
		},
		async adminSearchReps(input) {
			const { $supabase } = useNuxtApp();
			if (input.split(" ").length > 1) {
				let terms = input.split(" ");
				try {
					const { data, error } = await $supabase
						.from("sales_reps")
						.select("*")
						.or(
							`firstName.in.(${terms}),lastName.in.(${terms}),businessName.in.(${terms}),firstName.like.%${terms[0]}%,businessName.like.%${terms[0]}%,lastName.like.%${terms[0]}%,firstName.like.%${terms[1]}%,lastName.like.%${terms[1]}%,businessName.like.%${terms[0]}%`
						);
					if (error) {
						throw error;
					}
					return data;
				} catch (error) {
					console.log(error);
				}
			} else {
				try {
					const { data, error } = await $supabase
						.from("sales_reps")
						.select("*")
						.or(
							`firstName.like.%${input}%,lastName.like.%${input}%,businessName.like.%${input}%`
						);

					if (error) {
						throw error;
					}
					return data;
				} catch (error) {
					console.log(error);
				}
			}
		},
		// async getChildrenNames(children: string[]) {
		// 	const { $supabase } = useNuxtApp();
		// 	try {
		// 		let childrenNames = [];
		// 		children.forEach(async (child_id: string) => {

		// 			const { data, error } = await $supabase
		// 				.from("sales_reps")
		// 				.select("")
		// 			if (error) {
		// 				throw error;
		// 			}
		// 		});
		// 		return childrenNames;
		// 	} catch (error) {
		// 		console.log(error);
		// 	}
		// },
		clearState() {
			this.profile = null;
			this.adminSelectedProfile = null;
			this.salesRep = null;
			this.practice = null;
		},
	},
});
