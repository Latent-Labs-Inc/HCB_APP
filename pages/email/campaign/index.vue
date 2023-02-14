<template>
	<div class="grid gap-4">
		<h3 class="header">Upload Email</h3>
		<div class="grid gap-4">
			<transition name="fade" mode="out-in">
				<div class="grid gap-4" v-if="!areContacts">
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
				</div>
			</transition>
			<transition name="fade" mode="out-in">
				<div class="mx-auto w-96 mt-8" v-if="!areContacts">
					<UiImporter
						:fileTypes="['text/csv']"
						:fileError="'Please select a .csv file'"
						:id="'emails'"
						:label="'Emails'"
						@fileAdded="handleFile"
					/>
				</div>
				<div class="grid" v-else>
					<div class="flex">
						<p
							class="px-2 py-1 cursor-pointer mx-auto hover:dark:bg-black dark:bg-darkBg rounded-md trans bg-darkSecondary hover:bg-white"
							@click="clearContacts"
						>
							Clear Contacts
						</p>
						<p
							class="px-2 py-1 cursor-pointer mx-auto hover:dark:bg-black dark:bg-darkPrimary rounded-md trans bg-darkSecondary hover:bg-white"
							@click="handleEmail"
						>
							Send Emails
						</p>
					</div>
					<transition name="fade" mode="out-in">
						<ListAttorneys :data="attorneys" v-if="type === 'attorneys'" />
						<ListPropstream
							:data="propstreamContacts"
							v-else-if="skipTrace === 'propstream'"
						/>
						<ListClearSkipProbate
							:data="clearSkipProbateContacts"
							v-else-if="skipTrace === 'clearSkip_probate'"
						/>
						<ListClearSkipRegular
							:data="clearSkipRegularContacts"
							v-else-if="skipTrace === 'clearSkip_regular'"
						/>
					</transition>
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
	RelEmailObject,
} from '~/types/types';
import { Database } from '~/types/supabase';

const uiStore = useUiStore();
const client = useSupabaseClient<Database>();

const type = ref<'probates' | 'attorneys' | 'cashOffer'>('attorneys');
const skipTrace = ref<'propstream' | 'clearSkip_probate' | 'clearSkip_regular'>(
	'propstream'
);

const options = [
	{ value: 'cashOffer', label: 'Cash Offer' },
	{ value: 'probates', label: 'Probates' },
	{ value: 'attorneys', label: 'Attorneys' },
];

const skipTraceOptions = [
	{ value: 'propstream', label: 'Propstream' },
	{ value: 'clearSkip_probate', label: 'Clear Skip Probate' },
	{ value: 'clearSkip_regular', label: 'Clear Skip Regular' },
];

const handleOption = (value: string | boolean) => {
	type.value = value as 'probates' | 'attorneys' | 'cashOffer';
};

const handleSkipOptions = (value: string | boolean) => {
	skipTrace.value = value as
		| 'propstream'
		| 'clearSkip_probate'
		| 'clearSkip_regular';
};

// will need to change this to support more than just the attorneys
const areContacts = computed(() => {
	// check if there are contacts in any of the arrays
	return (
		attorneys.value.length > 0 ||
		propstreamContacts.value.length > 0 ||
		clearSkipProbateContacts.value.length > 0 ||
		clearSkipRegularContacts.value.length > 0
	);
});

const clearSkipProbateContacts = ref<ClearSkipProbate[]>([]);
const propstreamContacts = ref<PropSkipTrace[]>([]);
const clearSkipRegularContacts = ref<ClearSkipRegular[]>([]);
const attorneys = ref<FormattedProbates[]>([]);

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
			attorneys.value.push(...(formattedProbates as any[]));
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
	} else {
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
			formatData(results.data);
		};
	}
};

const formatData = (data: any[]) => {
	// I can choose to set up a basic interface for this and then use that to map the data to the correct keys and then push it to the contacts array and then use that to display the data
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
		// remove all that do not have an email or first name or last name
		formattedData = formattedData.filter(
			(contact) =>
				contact.email_1 !== null &&
				contact.first_name !== null &&
				contact.last_name !== null
		);
		// now push the data to the propstream contacts array
		propstreamContacts.value.push(...formattedData);
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
					? contact[key].toLowerCase()
					: null;
			}
			return formattedContact;
		});
		// remove all that do not have an email or first name or last name
		formattedData = formattedData.filter(
			(contact) =>
				contact.email_email1 !== null &&
				contact.pr_first_name !== null &&
				contact.pr_last_name !== null
		);
		// now push the data to the clearskip regular contacts array
		clearSkipRegularContacts.value.push(...formattedData);
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
					? contact[key].toLowerCase()
					: null;
			}
			return formattedContact;
		});
		// remove all that do not have an email or first name or last name
		formattedData = formattedData.filter(
			(contact) =>
				contact.rel1_email_1 !== null &&
				contact.rel1_first_name !== null &&
				contact.rel1_last_name !== null
		);

		// now push the data to the clearSkip probate contacts array
		clearSkipProbateContacts.value.push(...formattedData);
	}
};

const handleEmail = async () => {
	let usedEmails = [] as string[];
	if (type.value === 'attorneys') {
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
		let formattedContacts = attorneys.value as FormattedProbates[];
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
	} else if (type.value === 'probates') {
		if (skipTrace.value === 'clearSkip_probate') {
			let formattedContacts =
				clearSkipProbateContacts.value as ClearSkipProbate[];

			let emailObjects = [] as RelEmailObject[];
			// will want to get all the rel emails and send them an email
			// check if there is an email for all of the rel keys
			const getRelativeEmails = (contact: ClearSkipProbate) => {
				let relatives = [] as {
					emails: string[];
					first_name: string;
					last_name: string;
				}[];
				if (contact.rel1_email_1) {
					// check if there are additional emails for rel1
					// if so add them to the array
					let emails = [contact.rel1_email_1];
					if (contact.rel1_email_2) emails.push(contact.rel1_email_2);
					if (contact.rel1_email_3) emails.push(contact.rel1_email_3);
					relatives.push({
						emails,
						first_name: contact.rel1_first_name,
						last_name: contact.rel1_last_name,
					});
				}
				if (contact.rel2_email_1) {
					// check if there are additional emails for rel1
					// if so add them to the array
					let emails = [contact.rel2_email_1];
					if (contact.rel2_email_2) emails.push(contact.rel2_email_2);
					if (contact.rel2_email_3) emails.push(contact.rel2_email_3);
					relatives.push({
						emails,
						first_name: contact.rel2_first_name,
						last_name: contact.rel2_last_name,
					});
				}
				if (contact.rel3_email_1) {
					// check if there are additional emails for rel1
					// if so add them to the array
					let emails = [contact.rel3_email_1];
					if (contact.rel3_email_2) emails.push(contact.rel3_email_2);
					if (contact.rel3_email_3) emails.push(contact.rel3_email_3);
					relatives.push({
						emails,
						first_name: contact.rel3_first_name,
						last_name: contact.rel3_last_name,
					});
				}
				if (contact.rel4_email_1) {
					// check if there are additional emails for rel1
					// if so add them to the array
					let emails = [contact.rel4_email_1];
					if (contact.rel4_email_2) emails.push(contact.rel4_email_2);
					if (contact.rel4_email_3) emails.push(contact.rel4_email_3);
					relatives.push({
						emails,
						first_name: contact.rel4_first_name,
						last_name: contact.rel4_last_name,
					});
				}
				if (contact.rel5_email_1) {
					// check if there are additional emails for rel1
					// if so add them to the array
					let emails = [contact.rel5_email_1];
					if (contact.rel5_email_2) emails.push(contact.rel5_email_2);
					if (contact.rel5_email_3) emails.push(contact.rel5_email_3);
					relatives.push({
						emails,
						first_name: contact.rel5_first_name,
						last_name: contact.rel5_last_name,
					});
				}
				// remove duplicates
				relatives = relatives.filter((rel, index, self) => {
					return (
						index ===
						self.findIndex(
							(t) =>
								t.first_name === rel.first_name && t.last_name === rel.last_name
						)
					);
				});
				return relatives;
			};

			formattedContacts.forEach((contact) => {
				// get the relatives for each contact
				let relatives = getRelativeEmails(contact);
				// now we have all the relatives and we will create an email object for each relative
				relatives.forEach((rel) => {
					// create an email object for each relative
					rel.emails.forEach((email) => {
						// convert the first letter of the first name to uppercase
						let first_name =
							rel.first_name.charAt(0).toUpperCase() + rel.first_name.slice(1);
						let last_name =
							rel.last_name.charAt(0).toUpperCase() + rel.last_name.slice(1);
						let relName = `${first_name} ${last_name}`;
						let emailObject: RelEmailObject = {
							relEmail: email,
							subject: `Important for ${first_name} ${last_name}`,
							relName,
							address1: contact.input_address_1,
							city: contact.input_city,
							state: contact.input_state,
							zip: contact.input_zip_code,
						};
						emailObjects.push(emailObject);
					});
				});
			});
			// we need to send an email to each relative

			try {
				uiStore.toggleFunctionLoading(true);
				// send the emails
				const { data, error } = await $fetch(
					'/api/email/bulk-probate-relative',
					{
						method: 'POST',
						body: emailObjects,
					}
				);
			} catch (error) {
			} finally {
				uiStore.toggleFunctionLoading(false);
			}
		}
	} else if (type.value === 'cashOffer') {
	}
};

const clearContacts = () => {
	// clear all the arrays of contacts
	clearSkipProbateContacts.value = [];
	propstreamContacts.value = [];
	attorneys.value = [];
	clearSkipRegularContacts.value = [];
};
</script>

<style scoped></style>
