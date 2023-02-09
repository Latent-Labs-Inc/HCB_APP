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
				<div class="mx-auto w-96" v-if="data.length === 0">
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
						@click="handleGenerate"
					>
						Generate Email Templates
					</p>
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
			// @ts-ignore
			data.value.push(...formattedProbates);
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

const handleGenerate = async () => {
	let your_name = 'Chad Dudley';
	let usedEmails = [] as string[];
	let emails = [] as string[];
	data.value.forEach((probate) => {
		if (!probate.attorney_email) return console.log('no email', probate);
		if (!probate.attorney_last) return console.log('no attorney last', probate);
		if (!probate.pr_last || !probate.pr_first)
			return console.log('no pr name', probate);
		if (usedEmails.includes(probate.attorney_email)) return;
		let attorney_email = probate.attorney_email;
		let attorney_name = probate.attorney_last;
		let pr_name = probate.pr_first + ' ' + probate.pr_last;
		let address1 = probate.address1;
		let city = probate.city;
		let state = probate.state;
		let zip = probate.zip;
		const email = ref(
			`${attorney_email}\nImportant for Personal Rep ${pr_name}\nDear Attorney ${attorney_name},\n\nHello, my name is ${your_name}. I am inquiring about a probate case you are handling for the Personal Representative ${pr_name}, on ${address1}, ${city}, ${state}.\n\nI am very interested in this property. Would you please let the family know that I would like to make arrangements to view the property and make an offer? May I please have their contact information so I may reach out to them? I would also appreciate if you could forward this email to them as well.\n\nJust so you know, should you have any other Probate cases you are handling in the area I may be interested in those as well.\n\nThank you,\n${your_name}\nPhone:(813) 475-0728\nEmail: chad@highestcashbuyer.com\nhttp://highestcashbuyer.com/`
		);
		emails.push(email.value);
		usedEmails.push(attorney_email);
	});
	// convert emails into a text string file
	let emailString = emails.join('\n\n');
	let file = new File([emailString], 'emails.txt', {
		type: 'text/plain',
	});
	// download the file
	let url = window.URL.createObjectURL(file);

	let a = document.createElement('a');
	a.href = url;
	a.download = file.name;
	a.click();
	window.URL.revokeObjectURL(url);
};
</script>

<style scoped></style>
