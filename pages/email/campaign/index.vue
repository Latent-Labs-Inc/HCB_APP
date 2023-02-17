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
						<ListAttorneys :data="attorneys" v-if="type === 'attorney'" />
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
	EmailObject,
	AttorneyEmailObject,
} from '~/types/types';
import { Database } from '~/types/supabase';
import { useAuthStore } from '~~/stores/auth';

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
	formatContacts,
	filterEmailsFromTable,
	sendEmails,
} = useEmailCampaignData();

const handleFile = (file: File) => {
	if (type.value === 'attorney') {
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

const handleEmail = async () => {
	if (type.value === 'attorney') {
		const emailObjects = await formatContacts('attorney', type.value);

		let filteredEmailObjects = await filterEmailsFromTable(
			emailObjects!,
			'attorney_emails'
		);

		// send the emails
		await sendEmails(filteredEmailObjects, 'attorney', 'attorney');

		// now we will insert the emails into the database
		try {
			const { error: error } = await client.from('attorney_emails').insert(
				filteredEmailObjects.map((e) => ({
					email: e.email,
					user_id: useAuthStore().user_id!,
				}))
			);
			if (error) throw error;
		} catch (error) {
			console.log(error);
		}
	} else {
		// format the contacts
		const emailObjects = formatContacts(skipTrace.value, type.value);
		// filter the emails
		const filteredEmailObjects = await filterEmailsFromTable(
			emailObjects!,
			'email_campaigns'
		);

		// run the server endpoint to send the emails

		await sendEmails(emailObjects!, 'regular', type.value);

		// will bulk insert the emails into the email_campaigns table in supabase
		try {
			// const { data, error } = await client.from('email_campaigns').insert(
			// 	filteredEmailObjects.map((obj) => {
			// 		return {
			// 			user_id: useAuthStore().user_id!,
			// 			id: useUuid(),
			// 			address_1: obj.address1,
			// 			city: obj.city,
			// 			state: obj.state,
			// 			zip: obj.zip,
			// 			email: obj.email,
			// 			name: obj.name,
			// 			sent_at: new Date().toISOString(),
			// 			type: type.value,
			// 		};
			// 	})
			// );
			// if (error) throw error;
		} catch (error) {
			console.log(error);
		} finally {
			uiStore.toggleFunctionLoading(false);
			clearContacts();
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
