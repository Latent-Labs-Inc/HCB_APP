<template>
	<div class="m-8 flex gap-5 items-center justify-center">
		<p class="text-center text-lg">Search {{ label }}</p>
		<input
			class="p-1"
			type="text"
			v-model="modelValue"
			@input="emit('update:modelValue', modelValue)"
		/>
		<button @click="emit('search')">Search</button>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	modelValue: string;
	label: string;
}>();
const emit = defineEmits<{
	(e: "search");
	(e: "update:modelValue", val: string);
}>();
</script>
