<template>
	<div class="grid gap-4">
		<h3 class="header">Email</h3>
		<div class="grid gap-4">
			<h4 class="mx-auto text-white">Select Type</h4>
			<UiRadioInput
				class="mx-auto"
				:options="options"
				:selected="type"
				@option-clicked="handleOption"
				:row="true"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useUiStore } from '~/stores/ui';

const uiStore = useUiStore();

const type = ref<'personalReps' | 'attorneys'>('personalReps');

const options = [
	{ value: 'personalReps', label: 'Personal Reps' },
	{ value: 'attorneys', label: 'Attorneys' },
];
const handleOption = (value: string | boolean) => {
	type.value = value as 'personalReps' | 'attorneys';
};
</script>

<style scoped></style>
