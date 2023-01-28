<template>
	<div class="grid gap-4">
		<h3 class="header">Email</h3>
		<div class="grid gap-4">
			<h4 class="mx-auto text-white">Select Type</h4>
			<UiRadioSmall
				:reverse="false"
				v-model:modelValue="type"
				:radio-types="radioTypes"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useUiStore } from '~/stores/ui';

const uiStore = useUiStore();

const type = ref<'personalReps' | 'attorneys'>('personalReps');
const radioTypes = [
	{ id: 'personalReps', label: 'Personal Reps' },
	{ id: 'attorneys', label: 'Attorneys' },
];
</script>

<style scoped></style>
