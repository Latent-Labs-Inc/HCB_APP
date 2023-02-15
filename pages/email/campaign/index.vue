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
	ClearSkipProbate,
	ClearSkipRegular,
	RelEmailObject,
	StandardEmailObject,
} from '~/types/types';
import { Database } from '~/types/supabase';

const uiStore = useUiStore();
const client = useSupabaseClient<Database>();

const {
	type,
	skipTrace,
	options,
	skipTraceOptions,
	handleOption,
	handleSkipOptions,
} = useEmailRadioInput();

const {
	attorneys,
	propstreamContacts,
	clearSkipProbateContacts,
	clearSkipRegularContacts,
	areContacts,
	formatData,
} = useEmailCampaignData();

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
			formatData(results.data, skipTrace.value);
		};
	}
};

const formatClearSkipProbate = (contacts: ClearSkipProbate[]) => {
	let formattedContacts = clearSkipProbateContacts.value as ClearSkipProbate[];

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
		// create a function that capitalizes the first letter of the string\
		const capitalizeFirstLetter = (string: string) => {
			return string.charAt(0).toUpperCase() + string.slice(1);
		};
		relatives.forEach((rel) => {
			// create an email object for each relative
			rel.emails.forEach((email) => {
				// convert the first letter of the first name to uppercase
				let first_name = capitalizeFirstLetter(rel.first_name);
				let last_name = capitalizeFirstLetter(rel.last_name);
				let relName = `${first_name} ${last_name}`;
				let emailObject: RelEmailObject = {
					relEmail: email,
					subject: `Important for ${relName}`,
					relName,
					address1: capitalizeFirstLetter(contact.input_address_1),
					city: capitalizeFirstLetter(contact.input_city),
					state: capitalizeFirstLetter(contact.input_state),
					zip: contact.input_zip_code,
				};
				emailObjects.push(emailObject);
			});
		});
	});
	return emailObjects;
};

const formatClearSkipRegular = (contacts: ClearSkipRegular[]) => {
	// clear skip regular
	// get the contacts
	// create an array of email objects
	let emailObjects: StandardEmailObject[] = [];
	// create a function that capitalizes the first letter of the string
	const capitalizeFirstLetter = (string: string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};
	// loop through the contacts
	contacts.forEach((contact) => {
		// each contact will have multiple available email fields so you will need to check each of the fields for an email
		for (let key in contact) {
			if (key.includes('email_email')) {
				// check if the value is not null
				if (contact[key as keyof typeof contact]) {
					// create an email object
					let emailObject: StandardEmailObject = {
						email: contact[key as keyof typeof contact],
						subject: `Important for ${capitalizeFirstLetter(
							contact.input_first_name
						)} ${capitalizeFirstLetter(contact.input_last_name)}`,
						name: `${capitalizeFirstLetter(
							contact.input_first_name
						)} ${capitalizeFirstLetter(contact.input_last_name)}`,
						address1: capitalizeFirstLetter(contact.input_address_1),
						city: capitalizeFirstLetter(contact.input_city),
						state: capitalizeFirstLetter(contact.input_state),
						zip: contact.input_zip_code,
					};
					emailObjects.push(emailObject);
				}
			}
		}
	});
	return emailObjects;
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

			if (error) throw error;

			console.log(data);
		} catch (error) {
			console.log(error);
		} finally {
			uiStore.toggleFunctionLoading(false);
		}
	} else if (type.value === 'probates') {
		if (skipTrace.value === 'clearSkip_probate') {
			// we need to send an email to each relative
			const emailObjects = formatClearSkipProbate(
				clearSkipProbateContacts.value
			);
			try {
				uiStore.toggleFunctionLoading(true);
				// send the emails
				const { data, error } = await $fetch(
					'/api/email/bulk-probate-relative',
					{
						method: 'POST',
						body: { emailObjects },
					}
				);
				if (error) throw error;
				console.log(data);
			} catch (error) {
				console.log('error', error);
			} finally {
				uiStore.toggleFunctionLoading(false);
			}
		} else if (skipTrace.value === 'clearSkip_regular') {
			const emailObjects = formatClearSkipRegular(
				clearSkipRegularContacts.value
			);
			// create a function to send the emails
			const sendEmail = async (emailObject: StandardEmailObject) => {
				try {
					uiStore.toggleFunctionLoading(true);
					// send the emails
					const { data, error } = await $fetch('/api/email/single-regular', {
						method: 'POST',
						body: {
							emailObject,
							type: 'probate',
						},
					});
					if (error) throw error;
					console.log(data);
					console.log(emailObject);
				} catch (error) {
					console.log(error);
				} finally {
					uiStore.toggleFunctionLoading(false);
				}
			};
			// check email_campaigns table to see if there are any emails that have been sent to the same email address
			// if there are, then we will filter out the emailObjects that have the same email address
			let sentEmails = [] as string[];
			for (let i = 0; i < emailObjects.length; i += 50) {
				const { data, error } = await client
					.from('email_campaigns')
					.select('email')
					.in(
						'email',
						emailObjects.splice(i, 50).map((emailObject) => emailObject.email)
					);
				if (error) throw error;
				if (data) {
					sentEmails = [...sentEmails, ...data.map((email) => email.email)];
				}
			}
			const filteredEmailObjects =
				sentEmails.length > 0
					? emailObjects.filter(
							(emailObject) => !sentEmails.includes(emailObject.email)
					  )
					: emailObjects;

			for (let i = 0; i < filteredEmailObjects.length; i++) {
				await sendEmail(filteredEmailObjects[i]);
			}
		}
	} else if (type.value === 'cashOffer') {
		if (skipTrace.value === 'clearSkip_regular') {
			const emailObjects = formatClearSkipRegular(
				clearSkipRegularContacts.value
			);
			// create a function to send the emails
			const sendEmail = async (emailObject: StandardEmailObject) => {
				try {
					uiStore.toggleFunctionLoading(true);
					// send the emails
					const { data, error } = await $fetch('/api/email/single-regular', {
						method: 'POST',
						body: {
							emailObject,
							type: 'cashOffer',
						},
					});
					if (error) throw error;
					console.log(data);
				} catch (error) {
					console.log(error);
				} finally {
					uiStore.toggleFunctionLoading(false);
				}
			};
			// check email_campaigns table to see if there are any emails that have been sent to the same email address
			// if there are, then we will filter out the emailObjects that have the same email address
			let sentEmails = [] as string[];

			for (let i = 0; i < emailObjects.length; i += 50) {
				const { data, error } = await client
					.from('email_campaigns')
					.select('email')
					.in(
						'email',
						emailObjects.splice(i, 50).map((emailObject) => emailObject.email)
					);
				if (error) throw error;
				if (data) {
					sentEmails = [...sentEmails, ...data.map((email) => email.email)];
				}
			}

			const filteredEmailObjects =
				sentEmails.length > 0
					? emailObjects.filter(
							(emailObject) => !sentEmails.includes(emailObject.email)
					  )
					: emailObjects;

			for (let i = 0; i < filteredEmailObjects.length; i++) {
				await sendEmail(filteredEmailObjects[i]);
			}
		}
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
