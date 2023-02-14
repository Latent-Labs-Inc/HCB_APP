<template>
	<div>
		<h3 class="header">Upload Leads</h3>
		<div class="flex flex-col gap-8">
			<div class="my-6">
				<UiRadio v-model="leadProvider" :radio-types="providerTypes" />
			</div>
			<transition name="fade" mode="out-in">
				<div class="flex justify-center gap-4" v-if="leadProvider === 'other'">
					<label for="">Other: </label>
					<input type="text" v-model="otherProviderInput" />
				</div>
			</transition>
			<div class="my-6">
				<UiRadio v-model="leadType" :radio-types="leadTypes" />
			</div>
			<transition name="fade" mode="out-in">
				<div class="flex justify-center gap-4" v-if="leadType === 'other'">
					<label for="">Other: </label>
					<input type="text" v-model="otherLeadTypeInput" />
				</div>
			</transition>
			<div>
				<div class="mx-auto w-96">
					<UiImporter
						:fileTypes="['text/csv']"
						:fileError="'Please select a .csv file'"
						:id="'leads'"
						:label="'Leads'"
						@fileAdded="handleFile"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useLeadStore } from '~/stores/lead';
import Papa from 'papaparse';
import { Lead } from '~~/types/types';
import { useAuthStore } from '~~/stores/auth';
import { Database } from '~~/types/supabase';
import { useUiStore } from '~~/stores/ui';

const client = useSupabaseClient<Database>();
const authStore = useAuthStore();
const uiStore = useUiStore();

const leadProvider = ref('propStream');

const otherProviderInput = ref('');

const providerTypes = [
	{
		label: 'PropStream',
		id: 'propStream',
	},
	{
		label: 'Foreclosure Daily',
		id: 'foreclosureDaily',
	},
	{
		label: 'Fiverr',
		id: 'fiverr',
	},
	{
		label: 'Other',
		id: 'other',
	},
];

const leadType = ref('foreclosure');

const otherLeadTypeInput = ref('');

const leadTypes = [
	{
		label: 'Foreclosure',
		id: 'foreclosure',
	},
	{
		label: 'Probate',
		id: 'probate',
	},
	{
		label: 'Divorce',
		id: 'divorce',
	},
	{
		label: 'High Equity',
		id: 'highEquity',
	},
	{
		label: 'Other',
		id: 'other',
	},
];

const leadStore = useLeadStore();

onMounted(() => {
	leadStore.setLeadProvider('propStream');
	leadStore.setLeadType('foreclosure');
});

watch(leadProvider, (newProvider) => {
	leadStore.setLeadProvider(newProvider);
});

watch(leadType, (newType) => {
	leadStore.setLeadType(newType);
});

watch(otherProviderInput, (newProvider) => {
	leadStore.setLeadProvider(newProvider);
});

watch(otherLeadTypeInput, (newType) => {
	leadStore.setLeadType(newType);
});

interface FD_Contact {
	Cell: string;
	'Cell 2': string;
	'Cell 3': string;
	'Cell 4': string;
	City: string;
	'Company Name': string;
	DNC: string;
	'DNC 2': string;
	'DNC 3': string;
	'DNC 4': string;
	'Email 1': string;
	'Email 2': string;
	'Email 3': string;
	'Email 4': string;
	'First Name': string;
	Landline: string;
	'Landline 2': string;
	'Landline 3': string;
	'Landline 4': string;
	'Last Name': string;
	'Mail Address Same': string;
	'Mail City': string;
	'Mail State': string;
	'Mail Street Address': string;
	'Mail Zip': string;
	Phone: string;
	State: string;
	Status: string;
	'Street Address': string;
	Type: string;
	Zip: string;
}

const handleFile = (file: File) => {
	uiStore.toggleFunctionLoading(true);
	const reader = new FileReader();
	reader.onload = async (e) => {
		const csv = e.target?.result;
		const parsed = Papa.parse(csv as string, {
			header: true,
			skipEmptyLines: true,
		});
		const data = parsed.data as FD_Contact[];
		// remove all leads with a company name
		const contactLeads = data.filter((contact) => {
			return contact['Company Name'] === '';
		});

		// convert contact leads to lead type
		const leads: Lead[] = contactLeads.map((contact) => {
			const lead: Lead = {
				leadProvider: leadProvider.value,
				leadType: leadType.value,
				user_id: useAuthStore().user_id!,
				lead_id: useUuid(),
				propertyAddress: {
					address1: contact['Street Address'],
					address2: '',
					city: contact.City,
					state: contact.State,
					zip: contact.Zip,
				},
				ownerFirstName: contact['First Name'],
				ownerLastName: contact['Last Name'],
				wireless: [
					contact.Cell,
					contact['Cell 2'],
					contact['Cell 3'],
					contact['Cell 4'],
				],
				landline: [
					contact.Landline,
					contact['Landline 2'],
					contact['Landline 3'],
					contact['Landline 4'],
				],
				email: [
					contact['Email 1'],
					contact['Email 2'],
					contact['Email 3'],
					contact['Email 4'],
				],
				created_at: new Date().toDateString(),
				modified_at: new Date().toDateString(),
				texted: false,
				emailed: false,
				mailed: false,
				mailingAddress: {
					street: contact['Mail Street Address'],
					city: contact['Mail City'],
					state: contact['Mail State'],
					zip: contact['Mail Zip'],
				},
				favorite: false,
				favoritePhone: '',
				fileDate: new Date().toDateString(),
				prAddress: {},
				prFirstName: '',
				prLastName: '',
			};
			return lead;
		});
		try {
			const { data: insertedLeads, error } = await client
				.from('leads')
				.insert(leads);
			if (error) throw error;
		} catch (error) {
			console.log(error);
		} finally {
			uiStore.toggleFunctionLoading(false);
		}
	};

	reader.readAsText(file);
};
</script>
