import { defineStore } from "pinia";
import { Schedule } from "~/types/types";

export const useScheduleStore = defineStore("schedule", {
	state: () => ({
		schedule: [] as any[],
		selectedSchedule: null as any,
		lastFetch: null as Date,
	}),
	getters: {
		hasSchedules(state) {
			return state.schedule && state.schedule.length > 0;
		},
	},
	actions: {
		async uploadSchedules(schedules: any[]) {
			const { $supabase } = useNuxtApp();
			// figure out a way for a practice to do weekly imports or complete imports and then scheduling.
			try {
				const { data, error } = await $supabase.from("schedules").insert(schedules);
				if (error) {
					throw error;
				}
				this.schedules = data;
			} catch (e) {
				console.log(e);
			}
		},
		async addSchedule(schedule: any) {
			const { $supabase } = useNuxtApp();
			try {
				const { data, error } = await $supabase.from("schedules").insert(schedule);
				if (error) {
					throw error;
				}
				this.schedules = data;
			} catch (e) {
				console.log(e);
			}
		},
	},
});
