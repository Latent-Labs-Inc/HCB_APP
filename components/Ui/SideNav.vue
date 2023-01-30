<template>
	<nav class="min-h-screen bg-darkBg dark:bg-black">
		<ul
			class="grid items-center gap-4 mt-4"
			:class="
				uiStore.width < 440
					? 'xs:w-96 xs:absolute xs:z-10 xs:bg-black xs:h-full'
					: ''
			"
		>
			<li class="sidebar-li"><NuxtLink to="/">Home</NuxtLink></li>
			<li class="sidebar-li"><NuxtLink to="/messages">Messages</NuxtLink></li>
			<li class="sidebar-li"><NuxtLink to="/email">Email</NuxtLink></li>
			<li class="sidebar-li"><NuxtLink to="/leads">Leads</NuxtLink></li>
			<li class="sidebar-li"><NuxtLink to="/help">Help</NuxtLink></li>
		</ul>
	</nav>
</template>

<script setup lang="ts">
import { useUiStore } from '~/stores/ui';

const router = useRouter();
const uiStore = useUiStore();

router.afterEach(() => {
	console.log('name changed');
	if (uiStore.width < 440) {
		uiStore.toggleSidebar(false);
	}
});
</script>

<style scoped>
.sidebar-li {
	@apply py-1 px-6 text-center trans;
}
.sidebar-li:hover {
	cursor: pointer;
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
