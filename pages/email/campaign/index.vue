<template>
	<div class="grid gap-4">
		<h3 class="header">Upload Email</h3>
		<div class="grid gap-6">
			<h4 class="mx-auto text-white">Select Type</h4>
			<UiRadioInput
				class="mx-auto"
				:options="options"
				:selected="type"
				@option-clicked="handleOption"
				:row="true"
			/>
			<h4 class="mx-auto text-white">Upload to Supabase?</h4>
			<UiRadioInput
				class="mx-auto"
				:options="supabaseOptions"
				:selected="supabaseType"
				@option-clicked="handleSupabaseOption"
				:row="true"
			/>
			<transition name="fade" mode="out-in">
				<div class="mx-auto w-96" v-if="data.length === 0">
					<UiImporter
						:fileTypes="['text/csv']"
						:fileError="'Please select a .csv file'"
						:id="'emails'"
						:label="'Emails'"
						@fileAdded="handleFile"
					/>
				</div>
				<div v-else>
					<UiBaseList
						:colKeyPairs="colKeyPairs"
						:data="data"
						gridCols="grid-cols-5"
						itemName="'Probate'"
						:flip="true"
					/>
				</div>
			</transition>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useUiStore } from '~/stores/ui';
import Papa from 'papaparse';
import { FD_Probate, FormattedProbates } from '~/types/types';

const uiStore = useUiStore();
const client = useSupabaseClient();

const type = ref<'personalReps' | 'attorneys'>('personalReps');

const options = [
	{ value: 'personalReps', label: 'Personal Reps' },
	{ value: 'attorneys', label: 'Attorneys' },
];
const supabaseOptions = [
	{ value: true, label: 'Yes' },
	{ value: false, label: 'No' },
];
const supabaseType = ref(false);
const handleOption = (value: string | boolean) => {
	type.value = value as 'personalReps' | 'attorneys';
};
const handleSupabaseOption = (value: string | boolean) => {
	supabaseType.value = value as boolean;
};

const data = ref<FormattedProbates[]>([]);

const handleFile = (file: File) => {
	if (type.value === 'attorneys') {
		const reader = new FileReader();
		reader.readAsText(file);
		reader.onload = async (e) => {
			const csv = e.target!.result;
			const results: {
				data: FD_Probate[];
				errors: any[];
				meta: any;
			} = Papa.parse(csv as string, { header: true });
			let formattedProbates = await useProbateFormatter(results.data);
			data.value.push(...formattedProbates);
			let repeats = [];
			let unique = [];
			for (let i = 0; i < formattedProbates.length; i++) {
				if (unique.includes(formattedProbates[i].attorney_email)) {
					repeats.push(formattedProbates[i].attorney_email);
				} else {
					unique.push(formattedProbates[i].attorney_email);
				}
			}
			console.log('unique', unique);
			if (supabaseType.value) {
				try {
					uiStore.toggleFunctionLoading(true);
					const { error } = await client
						.from('probates')
						// @ts-ignore
						.insert(formattedProbates);
					if (error) throw error;
				} catch (error) {
					console.log(error);
				} finally {
					uiStore.toggleFunctionLoading(false);
				}
			}
			// will want to run the sendgrid api by hitting the server here
		};
	} else if (type.value === 'personalReps') {
	}
	console.log(file);
};

const colKeyPairs = reactive({
	'Attorney Email': 'attorney_email',
	'Property Address': 'address1',
	'Property City': 'city',
	'Property State': 'state',
	'Property Zip': 'zip',
});
</script>

<style scoped></style>
