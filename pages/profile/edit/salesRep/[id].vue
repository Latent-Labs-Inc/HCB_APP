<template>
	<div>
		<h3 class="header">Edit Profile</h3>
		<!-- <UiRadio :radioTypes="radioTypes" v-model="selectedRadio" /> -->
		<div v-if="authStore.isAdmin">
			<transition name="fade" mode="out-in">
				<ProfileRepEdit />
			</transition>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useProfileStore } from "~~/stores/profile";
import { useAuthStore } from "~~/stores/auth";
import { Profile } from "~~/types/types";

const route = useRoute();

const authStore = useAuthStore();
const profileStore = useProfileStore();

const profile: Profile = reactive({
	user_id: "",
	username: "",
	email: "",
	type: "practice",
	admin: false,
	practice_id: "",
	rep_id: "",
	created_at: null,
	modified_at: null,
});

onMounted(async () => {
	let id = route.params.id;
	let selectedProfile = await profileStore.fetchProfile(id);
	for (let key in profile) {
		profile[key] = selectedProfile[key];
	}
});
</script>

<style scoped></style>
