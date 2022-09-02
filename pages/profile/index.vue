<template>
	<div>
		<div>
			<h3 class="header">
				{{ authStore.isAdmin ? "Profile Search" : "Profile" }}
			</h3>
			<transition name="fade" mode="out-in">
				<div>Phone Number</div>
				<!-- we will need to have custom phone numbers -->
				<!-- <ProfileAdmin v-if="profile?.admin || authStore.isAdmin" /> -->
			</transition>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~~/stores/auth";
import { useProfileStore } from "~~/stores/profile";

const authStore = useAuthStore();
const profileStore = useProfileStore();
const profile = ref(null);
onBeforeMount(() => {
	profile.value = profileStore.profile;
});
</script>

<style scoped></style>
