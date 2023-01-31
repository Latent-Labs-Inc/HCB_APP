<template>
	<div class="grid gap-4">
		<h3 class="header">Upload Email</h3>
		<div class="grid gap-4">
			<h4 class="mx-auto text-white">Select Type</h4>
			<UiRadioInput
				class="mx-auto"
				:options="options"
				:selected="type"
				@option-clicked="handleOption"
				:row="true"
			/>
			<div class="mx-auto w-96">
				<UiImporter
					:fileTypes="['text/csv']"
					:fileError="'Please select a .csv file'"
					:id="'emails'"
					:label="'Emails'"
					@fileAdded="handleFile"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useUiStore } from '~/stores/ui';
import Papa from 'papaparse';
import { FD_Probate } from '~/types/types';

const uiStore = useUiStore();
const client = useSupabaseClient();

const type = ref<'personalReps' | 'attorneys'>('personalReps');

const options = [
	{ value: 'personalReps', label: 'Personal Reps' },
	{ value: 'attorneys', label: 'Attorneys' },
];
const handleOption = (value: string | boolean) => {
	type.value = value as 'personalReps' | 'attorneys';
};

const handleFile = (file: File) => {
	if (type.value === 'personalReps') {
		const reader = new FileReader();
		reader.readAsText(file);
		reader.onload = async (e) => {
			const csv = e.target!.result;
			const results: {
				data: FD_Probate[];
				errors: any[];
				meta: any;
			} = Papa.parse(csv as string, { header: true });
			const formattedProbates = await useProbateFormatter(results.data);

			try {
				uiStore.toggleFunctionLoading(true);
				const { error } = await client
					.from('probates')
					.insert(formattedProbates);
				if (error) throw error;
			} catch (error) {
				console.log(error);
			} finally {
				uiStore.toggleFunctionLoading(false);
			}
		};
	} else if (type.value === 'attorneys') {
	}
	console.log(file);
};
</script>

<style scoped></style>
