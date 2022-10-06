<template>
	<nav class="min-h-screen bg-darkBg dark:bg-black">
		<ul
			class="flex flex-col items-center gap-4"
			:class="
				uiStore.width < 440
					? 'xs:w-96 xs:absolute xs:z-10 xs:bg-black xs:h-full'
					: ''
			"
		>
			<li class="sidebar-li"><NuxtLink to="/">Home</NuxtLink></li>
			<li class="sidebar-li"><NuxtLink to="/messages">Messages</NuxtLink></li>
			<li class="sidebar-li"><NuxtLink to="/leads">Leads</NuxtLink></li>
			<li class="sidebar-li"><NuxtLink to="/help">Help</NuxtLink></li>
		</ul>
	</nav>
</template>

<script setup lang="ts">
import { useUiStore } from "~/stores/ui";

const uiStore = useUiStore();
</script>

<style scoped>
* {
	margin: 0;
	padding: 0;
}
.sidebar-li {
	font-size: 1.3rem;
	@apply flex align-middle py-1 px-6 justify-center text-center trans rounded-3xl;
}
.sidebar-li:hover {
	cursor: pointer;
	@apply bg-secondary dark:bg-darkPrimary py-2 px-8 rounded-full;
}
a {
	text-decoration: none;
	color: white;
}
a.active,
a.router-link-exact-active {
	color: white;
}
</style>
