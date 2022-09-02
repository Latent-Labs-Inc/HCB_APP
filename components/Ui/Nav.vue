<script setup lang="ts">
import { useUiStore } from "../../stores/ui";
import { useAuthStore } from "../../stores/auth";
import IconMoon from "~icons/fa-solid/moon";
import IconSun from "~icons/fa-solid/sun";
import IconBars from "~icons/fa-solid/bars";

const uiStore = useUiStore();
const authStore = useAuthStore();

onBeforeMount(async () => {
	await authStore.checkRefresh();
});

const handleSignOut = async () => {
	uiStore.toggleFunctionLoading(true);
	await authStore.signOut();
	uiStore.toggleSidebar(false);
	uiStore.toggleFunctionLoading(false);
};
const handleSidebar = () => {
	if (authStore.isLoggedIn) {
		uiStore.toggleSidebar();
	}
};
</script>

<template>
	<nav class="">
		<div class="flex items-center nav">
			<NuxtLink class="logo px-5 text-xl" to="/"
				><img
					v-if="uiStore.theme === 'light'"
					class="h-fit w-32 top-0 trans p-2"
					src="~/assets/images/HCB-logo-light.png"
					alt="" /><img
					v-else
					class="h-fit w-32 top-0 trans p-2"
					src="~/assets/images/HCB-logo-dark.png"
					alt=""
			/></NuxtLink>
			<div class="flex flex-auto">
				<icon-bars class="icon" @click="handleSidebar" />
				<ul id="nav-mobile" class="nav-ul flex-auto justify-end">
					<transition name="fade" mode="out-in">
						<icon-moon
							class="icon"
							v-if="uiStore.theme === 'light'"
							@click="uiStore.toggleTheme"
						/>
						<icon-sun class="icon" v-else @click="uiStore.toggleTheme" />
					</transition>
					<!-- <li class="nav-li">
						<NuxtLink to="/contact">Contact</NuxtLink>
					</li> -->
					<li class="nav-li">
						<NuxtLink to="/settings">Settings</NuxtLink>
					</li>
					<li class="nav-li trans" @click="handleSignOut">
						<client-only>
							<NuxtLink to="/auth">{{
								authStore.isLoggedIn ? "Sign Out" : "Sign In"
							}}</NuxtLink>
						</client-only>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</template>

<style scoped>
.logo {
	@apply cursor-pointer mr-2 text-primary dark:text-darkSecondary hover:dark:text-darkPrimary trans;
}
.nav {
	@apply text-primary dark:text-darkSecondary;
}

.nav-ul {
	display: flex;
	list-style: none;
}

.nav-li {
	padding: 20px;
	@apply hover:text-secondary hover:dark:text-darkPrimary cursor-pointer trans;
}
</style>
