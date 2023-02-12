<template>
	<div class="grid gap-4">
		<h3 class="header">Upload Email</h3>
		<div class="grid gap-4">
			<UiRadioInput
				class="mx-auto"
				:options="options"
				:question="'Select Type of Email'"
				:selected="type"
				@option-clicked="handleOption"
				:row="true"
			/>
			<UiRadioInput
				class="mx-auto"
				:options="skipTraceOptions"
				:question="'Select Source of Skip Tracing'"
				:selected="skipTrace"
				@option-clicked="handleSkipOptions"
				:row="true"
			/>
			<transition name="fade" mode="out-in">
				<div class="mx-auto w-96 mt-8" v-if="contacts.length === 0">
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
import {
	FD_Probate,
	FormattedProbates,
	PropSkipTrace,
	ClearSkipProbate,
	ClearSkipRegular,
} from '~/types/types';
import { Database } from '~/types/supabase';

const uiStore = useUiStore();
const client = useSupabaseClient<Database>();

const type = ref<'personalReps' | 'attorneys' | 'standard'>('attorneys');
const skipTrace = ref<'propstream' | 'clearSkip_probate' | 'clearSkip_regular'>(
	'propstream'
);

const options = [
	{ value: 'standard', label: 'Standard' },
	{ value: 'personalReps', label: 'Personal Reps' },
	{ value: 'attorneys', label: 'Attorneys' },
];

const skipTraceOptions = [
	{ value: 'propstream', label: 'Propstream' },
	{ value: 'clearSkip_probate', label: 'Clear Skip Probate' },
	{ value: 'clearSkip_regular', label: 'Clear Skip Regular' },
];

const handleOption = (value: string | boolean) => {
	type.value = value as 'personalReps' | 'attorneys' | 'standard';
};

const handleSkipOptions = (value: string | boolean) => {
	skipTrace.value = value as
		| 'propstream'
		| 'clearSkip_probate'
		| 'clearSkip_regular';
};

// will need to change this to support more than just the attorneys
const contacts = ref<
	| FormattedProbates[]
	| PropSkipTrace[]
	| ClearSkipProbate[]
	| ClearSkipRegular[]
>([]);

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
			contacts.value.push(...(formattedProbates as any[]));
			let repeats = [] as string[];
			let unique = [] as string[];
			for (let i = 0; i < formattedProbates.length; i++) {
				if (unique.includes(formattedProbates[i].attorney_email)) {
					repeats.push(formattedProbates[i].attorney_email);
				} else {
					unique.push(formattedProbates[i].attorney_email);
				}
			}
		};
	} else if (type.value === 'personalReps') {
		const reader = new FileReader();
		reader.readAsText(file);
		reader.onload = async (e) => {
			const csv = e.target!.result;
			const results: {
				data: any[];
				errors: any[];
				meta: any;
			} = Papa.parse(csv as string, { header: true });
			// map the data to the same key but convert the keys to lowercase and replace all the spaces with underscores
			let formattedData = formatData(results.data);
			console.log(formattedData);
		};
	} else if (type.value === 'standard') {
		const reader = new FileReader();
		reader.readAsText(file);
		reader.onload = async (e) => {
			const csv = e.target!.result;
			const results: {
				data: any[];
				errors: any[];
				meta: any;
			} = Papa.parse(csv as string, { header: true });
			// map the data to the same key but convert the keys to lowercase and replace all the spaces with underscores
			let formattedData = formatData(results.data);
			console.log(formattedData);
		};
	}
};

const formatData = (data: any[]) => {
	// I can choose to set up a basic interface for this and then use that to map the data to the correct keys and then push it to the contacts array and then use that to display the data
	let formattedContacts = [] as any[];
	if (skipTrace.value === 'propstream') {
		let formattedData = data.map((contact) => {
			let formattedContact = {} as PropSkipTrace;
			for (let key in contact) {
				// check if there is a colon and remove that
				let formattedKey = key
					.toLowerCase()
					.replace(/ /g, '_')
					.replace(':', '');
				// check if the key is blank and if so remove it, remove all that do not have an email
				if (formattedKey === '') {
					continue;
				}
				formattedContact[formattedKey as keyof PropSkipTrace] = contact[key]
					? contact[key]
					: null;
			}
			return formattedContact;
		});
		// remove all that do not have an email
		formattedData = formattedData.filter((contact) => contact.email_1);

		formattedContacts.push(...formattedData);
	} else if (skipTrace.value === 'clearSkip_regular') {
		let formattedData = data.map((contact) => {
			let formattedContact = {} as ClearSkipRegular;
			for (let key in contact) {
				// check if there is a colon and remove that
				let formattedKey = key
					.toLowerCase()
					.replace(/ /g, '_')
					.replace(':', '');
				// check if the key is blank and if so remove it
				if (formattedKey === '') {
					continue;
				}
				formattedContact[formattedKey as keyof ClearSkipRegular] = contact[key]
					? contact[key]
					: null;
			}
			return formattedContact;
		});
		// remove all that do not have an email
		formattedData = formattedData.filter((contact) => contact.email_email1);

		formattedContacts.push(...formattedData);
	} else if (skipTrace.value === 'clearSkip_probate') {
		let formattedData = data.map((contact) => {
			let formattedContact = {} as ClearSkipProbate;
			for (let key in contact) {
				// check if there is a colon and remove that
				let formattedKey = key
					.toLowerCase()
					.replace(/ /g, '_')
					.replace(':', '');
				// check if the key is blank and if so remove it
				if (formattedKey === '') {
					continue;
				}
				formattedContact[formattedKey as keyof ClearSkipProbate] = contact[key]
					? contact[key]
					: null;
			}
			return formattedContact;
		});
		// remove all that do not have an email
		formattedData = formattedData.filter((contact) => contact.rel1_email_1);

		formattedContacts.push(...formattedData);
	}

	return formattedContacts;
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
	if (type.value === 'attorneys') {
		let formattedContacts = contacts.value as FormattedProbates[];
		formattedContacts.forEach((contact) => {
			if (!contact.attorney_email) return console.log('no email', contact);
			if (!contact.attorney_last)
				return console.log('no attorney last', contact);
			if (!contact.pr_last || !contact.pr_first)
				return console.log('no pr name', contact);
			if (usedEmails.includes(contact.attorney_email)) return;
			const emailObject = {
				attorneyEmail: contact.attorney_email,
				attorneyName: contact.attorney_last,
				subject: `Important for ${contact.pr_first + ' ' + contact.pr_last}`,
				prName: contact.pr_first + ' ' + contact.pr_last,
				address1: contact.address1,
				city: contact.city,
				state: contact.state,
				zip: contact.zip,
			};
			emailObjects.push(emailObject);
			usedEmails.push(contact.attorney_email);
		});
		try {
			uiStore.toggleFunctionLoading(true);
			const { data, error } = await $fetch('/api/email/send-bulk-attorneys', {
				method: 'POST',
				body: emailObjects,
			});
		} catch (error) {
			console.log(error);
		} finally {
			uiStore.toggleFunctionLoading(false);
		}
	} else if (type.value === 'personalReps') {
	} else if (type.value === 'standard') {
	}
};
</script>

<style scoped></style>
