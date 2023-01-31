<template>
	<nav class="min-h-screen bg-primary dark:bg-black">
		<div
			class="pt-2 border-2 border-y-0 border-l-0 border-solid border-primary dark:border-darkBg h-full dark:text-white text-primary flex flex-col gap-4"
		>
			<div class="sidebar-element" data-tip="Home">
				<NuxtLink
					to="/"
					class="flex p-3 cursor-pointer trans mx-2 rounded-md text-lg"
					><IcRoundHome
				/></NuxtLink>
			</div>
			<div class="sidebar-element" data-tip="Messages">
				<NuxtLink
					to="/messages"
					class="flex p-3 cursor-pointer trans mx-2 rounded-md text-lg"
					><IcBaselineMessage
				/></NuxtLink>
			</div>
			<div class="sidebar-element" data-tip="Email">
				<NuxtLink
					to="/email"
					class="flex p-3 cursor-pointer trans mx-2 rounded-md text-lg"
					><IcBaselineEmail
				/></NuxtLink>
			</div>
			<div class="sidebar-element" data-tip="Leads">
				<NuxtLink
					to="/leads"
					class="flex p-3 cursor-pointer trans mx-2 rounded-md text-lg"
					><IcBaselineAdsClick
				/></NuxtLink>
			</div>
			<div class="sidebar-element" data-tip="Help">
				<NuxtLink
					to="/help"
					class="flex p-3 cursor-pointer trans mx-2 rounded-md text-lg"
					><IcBaselineHelp
				/></NuxtLink>
			</div>
		</div>
	</nav>
</template>

<script setup lang="ts">
// @ts-ignore
import IcRoundHome from '~icons/ic/round-home';
// @ts-ignore
import IcBaselineMessage from '~icons/ic/baseline-message';
// @ts-ignore
import IcBaselineEmail from '~icons/ic/baseline-email';
// @ts-ignore
import IcBaselineAdsClick from '~icons/ic/baseline-ads-click';
// @ts-ignore
import IcBaselineHelp from '~icons/ic/baseline-help';
import { useUiStore } from '~/stores/ui';

const router = useRouter();
const uiStore = useUiStore();

router.afterEach(() => {
	console.log('name changed');
	if (uiStore.width! < 440) {
		uiStore.toggleSidebar(false);
	}
});
</script>

<style scoped>
.sidebar-element {
	@apply relative before:z-10 before:absolute before:-right-3 before:top-1/2 before:w-max before:max-w-xs before:translate-x-full before:-translate-y-1/2 before:rounded-md before:bg-darkBg before:px-2 before:py-1 before:text-white before:invisible before:content-[attr(data-tip)] after:z-10 after:absolute after:-right-[0.8rem] after:top-1/2 after:h-0 after:w-0 after:translate-x-0 after:-translate-y-1/2 after:border-8 after:border-r-darkBg after:border-l-transparent after:border-b-transparent after:border-t-transparent after:invisible hover:before:visible hover:after:visible text-sm;
}
a {
	text-decoration: none;
	color: white;
}
a.active,
a.router-link-exact-active {
	color: white;
	@apply dark:bg-darkBg bg-secondary;
}
</style>
