<template>
	<div class="grid gap-4">
		<h3 class="header">Upload Email</h3>
		<div class="grid gap-4">
			<UiRadioInput
				class="mx-auto"
				:options="options"
				:selected="type"
				:question="'Select Type?'"
				@option-clicked="handleOption"
				:row="true"
			/>
			<UiRadioInput
				class="mx-auto"
				:options="supabaseOptions"
				:question="'Add to Supabase?'"
				:selected="supabaseType"
				@option-clicked="handleSupabaseOption"
				:row="true"
			/>
			<transition name="fade" mode="out-in">
				<div class="mx-auto w-96" v-if="contacts.length === 0">
					<UiImporter
						:fileTypes="['text/csv']"
						:fileError="'Please select a .csv file'"
						:id="'emails'"
						:label="'Emails'"
						@fileAdded="handleFile"
					/>
				</div>
				<div class="grid" v-else>
					<p
						class="px-2 py-1 cursor-pointer mx-auto hover:dark:bg-black dark:bg-darkBg rounded-md trans bg-darkSecondary hover:bg-white"
						@click="handleEmail"
					>
						Send Emails
					</p>
					<UiBaseList
						:colKeyPairs="colKeyPairs"
						:data="contacts"
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
import { Database } from '~/types/supabase';

const uiStore = useUiStore();
const client = useSupabaseClient<Database>();

const type = ref<'personalReps' | 'attorneys'>('attorneys');

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

const contacts = ref<FormattedProbates[]>([]);

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

			contacts.value.push(...formattedProbates);
			let repeats = [] as string[];
			let unique = [] as string[];
			for (let i = 0; i < formattedProbates.length; i++) {
				if (unique.includes(formattedProbates[i].attorney_email)) {
					repeats.push(formattedProbates[i].attorney_email);
				} else {
					unique.push(formattedProbates[i].attorney_email);
				}
			}
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

const handleEmail = async () => {
	let usedEmails = [] as string[];
	let emailObjects = [] as {
		attorneyEmail: string;
		subject: string;
		attorneyName: string;
		prName: string;
		address1: string;
		city: string;
		state: string;
		zip: string;
	}[];

	contacts.value.forEach((probate) => {
		if (!probate.attorney_email) return console.log('no email', probate);
		if (!probate.attorney_last) return console.log('no attorney last', probate);
		if (!probate.pr_last || !probate.pr_first)
			return console.log('no pr name', probate);
		if (usedEmails.includes(probate.attorney_email)) return;
		const emailObject = {
			attorneyEmail: probate.attorney_email,
			attorneyName: probate.attorney_last,
			subject: `Important for ${probate.pr_first + ' ' + probate.pr_last}`,
			prName: probate.pr_first + ' ' + probate.pr_last,
			address1: probate.address1,
			city: probate.city,
			state: probate.state,
			zip: probate.zip,
		};
		emailObjects.push(emailObject);
		usedEmails.push(probate.attorney_email);
	});

	try {
		uiStore.toggleFunctionLoading(true);
		const { data, error } = await $fetch('/api/email/send-bulk', {
			method: 'POST',
			body: emailObjects,
		});
	} catch (error) {
		console.log(error);
	} finally {
		uiStore.toggleFunctionLoading(false);
	}
};
</script>

<style scoped></style>
