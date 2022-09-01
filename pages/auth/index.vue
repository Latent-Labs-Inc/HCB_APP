<template>
	<div>
		<div class="flex items-center justify-center" v-if="!authStore.isLoggedIn">
			<transition name="fade" mode="out-in">
				<AuthCard
					class="w-2/3 justify-center items-center"
					v-if="!authStore.resettingPassword"
				/>
				<AuthRecoveryCard v-else class="mx-auto w-2/3" />
			</transition>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~~/stores/auth";
import { useUiStore } from "~~/stores/ui";

const authStore = useAuthStore();
const uiStore = useUiStore();
const router = useRouter();

// definePageMeta({
// 	middleware: ["page-load"],
// });

if (!authStore.isLoggedIn) {
	await authStore.checkRefresh();
}
if (authStore.isLoggedIn) {
	router.push("/");
	uiStore.toggleSidebar(true);
}
</script>

<style>
* {
	margin: 0;
	padding: 0;
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
