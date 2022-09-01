import { defineStore } from "pinia";
import { Patient } from "~/types/types";

export const usePatientStore = defineStore("patients", {
	state: () => ({
		patients: [] as Patient[],
		selectedPatient: null as Patient,
		lastFetch: null as Date,
	}),
	getters: {
		hasPatients(state) {
			return state.patients && state.patients.length > 0;
		},
		shouldUpdate(state) {
			const lastFetch = state.lastFetch;
			if (!lastFetch) {
				return true;
			}
			const currentTimeStamp = new Date().getTime();
			return (currentTimeStamp - lastFetch.getTime()) / 1000 > 60;
		},
		getPatients(state) {
			return state.patients;
		},
	},
	actions: {
		async uploadPatients(patients: Patient[]) {
			const { $supabase } = useNuxtApp();
			// figure out a way for a practice to do weekly imports or complete imports and then scheduling.
			try {
				const { data, error } = await $supabase.from("patients").insert(patients);
				if (error) {
					throw error;
				}
				this.patients = data;
			} catch (e) {
				console.log(e);
			}
		},
		async addPatient(patient: Patient) {
			const { $supabase } = useNuxtApp();
			// check if this works later lol
			try {
				const { data, error } = await $supabase
					.from("patients")
					.select("*")
					.eq("firstName", patient.firstName)
					.eq("lastName", patient.lastName)
					.eq("dob", patient.dob)
					.eq("user_id", patient.user_id);
				if (error) {
					throw error;
				}
				if (data.length === 0) {
					const { error } = await $supabase.from("patients").insert(patient);
					if (error) {
						throw error;
					}
				} else {
					console.log("upserting patient");
					patient.patient_id = data[0].patient_id;
					patient.modified_at = new Date();
					patient.created_at = data[0].created_at;
					const { error } = await $supabase.from("patients").upsert(patient);
					if (error) {
						throw error;
					}
				}
			} catch (e) {
				console.log(e);
			}
		},
		async fetchPatients() {
			const { $supabase } = useNuxtApp();
			if (this.shouldUpdate) {
				console.log("fetching patients");
				try {
					let { data: patients, error } = await $supabase
						.from("patients")
						.select("*");
					if (error) {
						throw error;
					}
					this.patients = patients;
					return patients;
				} catch (e) {
					console.log(e);
				}
			}
		},
		clearState() {
			this.patients = [];
			this.lastFetch = null;
			this.selectedPatient = null;
		},
		async searchPatient(searchTerms) {
			const { $supabase } = useNuxtApp();
			const terms = searchTerms.split(" ");
			try {
				const { data, error } = await $supabase
					.from("patients")
					.select("*")
					.or(
						`firstName.in.(${terms}),lastName.in.(${terms}),firstName.like.%${terms[0]}%,firstName.like.%${terms[1]}%,lastName.like.%${terms[0]}%,lastName.like.%${terms[1]}%`
					)
					.order("lastName", { ascending: true });
				if (error) {
					throw error;
				}
				return data;
			} catch (e) {
				console.log(e);
			}
		},
		setSelectedPatient(patient: Patient) {
			this.selectedPatient = patient;
		},
		async deletePatient(patient_id: string) {
			const { $supabase } = useNuxtApp();
			try {
				const { error } = await $supabase
					.from("patients")
					.delete()
					.eq("patient_id", patient_id);
				if (error) {
					throw error;
				}
				const index = this.patients.findIndex(
					(patient) => patient.patient_id === patient_id
				);
				if (index > -1) {
					this.patients.splice(index, 1);
				}
			} catch (e) {
				console.log(e);
			}
		},
	},
});
