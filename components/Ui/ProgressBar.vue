<template>
	<div class="mx-8 bg-gray-200 rounded-full dark:bg-black">
		<div
			class="bg-primary dark:bg-darkPrimary text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full h-6 flex items-center justify-center"
			:style="{ width: barStyle.width, transition: 'width 0.5s ease-in-out' }"
		>
			<div class="my-auto">
				{{ barStyle.width }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	value: number;
	max: number;
	color?: string;
	labelColor?: string;
}>();

const { value, max, color } = toRefs(props);

const barStyle = computed(() => {
	return {
		width: `${Math.ceil((value.value / max.value) * 100)}%`,
	};
});
</script>

<style scoped></style>
