<template>
	<div>
		<h3 class="header">Edit Profile</h3>
		<transition name="fade" mode="out-in">
			<ProfilePracticeEdit />
		</transition>
	</div>
</template>

<script setup lang="ts">
import { useProfileStore } from "~~/stores/profile";
import { Profile } from "~~/types/types";

const route = useRoute();

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
