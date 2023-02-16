<template>
	<div class="w-full bg-gray-200 rounded-full dark:bg-black">
		<div>{{ label }}</div>
		<div
			class="bg-primary dark:bg-darkPrimary text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
			:style="{ width: `${(props.value / props.max) * 100}%` }"
		>
			{{ barStyle.width }}
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	value: number;
	max: number;
	color?: string;
	label: string;
	labelColor?: string;
}>();

const { value, max, color, label, labelColor } = toRefs(props);

const barStyle = computed(() => {
	return {
		width: `${(value.value / max.value) * 100}%`,
	};
});
</script>

<style scoped></style>
