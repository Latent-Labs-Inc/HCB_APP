<template>
	<div class="grid gap-8 dark:text-white text-primary">
		<h3 class="header">Send Messages</h3>
		<transition name="fade" mode="out-in">
			<div class="grid gap-4 mx-auto">
				<UiRadioInput
					v-for="(radio, index) in radios"
					:key="radio.id"
					class="mx-auto"
					:question="radio.question"
					:options="radio.options"
					:selected="radio.selected"
					@option-clicked="handleOption(index, $event)"
					:row="true"
				/>
				<transition name="fade" mode="out-in">
					<div class="grid gap-4" v-if="!templateSelected">
						<transition name="fade" mode="out-in">
							<textarea v-model.trim="message" v-if="!radios[2].selected" />
							<div class="flex my-auto gap-4 justify-center" v-else>
								<label class="my-auto" for="">Search</label>
								<input class="py-0" type="text" v-model.trim="templateInput" />
								<p
									class="my-auto px-4 py-2 dark:bg-darkBg bg-primary rounded-lg cursor-pointer dark:hover:bg-darkPrimary hover:bg-primary trans"
									@click="searchTemplates"
								>
									Search
								</p>
							</div>
						</transition>
					</div>
					<div class="grid gap-2" v-else>
						<p class="mx-auto">Selected Message</p>
						<p class="my-auto">{{ templateSelected.message }}</p>
					</div>
				</transition>
				<div class="flex">
					<button
						class="mx-auto reverse mt-4 bg-primary text-white hover:text-primary hover:bg-white dark:bg-darkBg border-none"
						@click="searchLeads('search')"
					>
						{{ leads.length > 0 ? 'Search New' : 'Search Leads' }}
					</button>
					<button
						v-if="leads.length > 0"
						class="mx-auto reverse mt-4 border-none bg-darkSecondary dark:bg-darkPrimary hover:dark:bg-black"
						@click="searchLeads('toggle')"
					>
						{{ showLeads ? 'Hide Leads' : 'Show Leads' }}
					</button>
				</div>
				<transition name="fade" mode="out-in">
					<UiBaseList
						v-if="templates.length > 0"
						:data="templates"
						:gridCols="'grid-cols-2'"
						:colKeyPairs="templateColKeyPairs"
						:showAdd="false"
						:itemName="'Template'"
						:flip="true"
						@selected="handleSelected('template', $event)"
					/>
				</transition>
				<transition name="fade" mode="out-in">
					<UiBaseList
						v-if="showLeads"
						:data="leads"
						:gridCols="'grid-cols-5'"
						:colKeyPairs="leadColKeyPairs"
						:showAdd="false"
						:itemName="'Lead'"
						:flip="true"
						@selected="handleSelected('lead', $event)"
					/>
				</transition>
			</div>
		</transition>
		<div class="flex justify-center mt-4 mb-24">
			<button @click="sendTexts" class="border-none">Send Bulk Messages</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Template, Lead } from '~~/types/types';
import { Database } from '~/types/supabase';
import { useUiStore } from '~/stores/ui';
import { useAuthStore } from '~~/stores/auth';

const authStore = useAuthStore();
const uiStore = useUiStore();
const router = useRouter();
const client = useSupabaseClient<Database>();

const message = ref('');
const templateSelected = ref(null as Template | null);
const templateInput = ref('');
const templates = ref([] as Template[]);

const sentMessages = ref<number>(0);

const leads = ref([] as Lead[]);
const showLeads = ref(false);

const leadColKeyPairs = reactive({
	'Lead Provider': 'leadProvider',
	'Lead Type': 'leadType',
	Address: 'propertyAddress.address1',
	City: 'propertyAddress.city',
	'Phone Numbers': 'wireless',
});
const templateColKeyPairs = reactive({
	Name: 'name',
	Message: 'message',
});

const radios = ref([
	{
		id: 'provider',
		question: 'Select Lead Provider',
		selected: 'all',
		options: [
			{ value: 'all', label: 'All' },
			{ value: 'propStream', label: 'Propstream' },
			{ value: 'foreclosureDaily', label: 'Foreclosure Daily' },
			{ value: 'fiverr', label: 'Fiverr' },
			{ value: 'other', label: 'Other' },
		],
	},
	{
		id: 'type',
		question: 'Select Lead Type',
		selected: 'all',
		options: [
			{ value: 'all', label: 'All' },
			{ value: 'probate', label: 'Probate' },
			{ value: 'foreclosure', label: 'Foreclosure' },
			{ value: 'evictions', label: 'Evictions' },
			{ value: 'other', label: 'Other' },
		],
	},
	{
		id: 'template',
		question: 'Use Template Message',
		selected: true,
		options: [
			{ value: true, label: 'Yes' },
			{ value: false, label: 'No' },
		],
	},
]);

const handleOption = (index: number, value: string | boolean) => {
	radios.value[index].selected = value as string;
	if (index === 2) {
		if (value === false) {
			templateSelected.value = null;
		}
	}
};

const handleSelected = (type: 'template' | 'lead', item: Template | Lead) => {
	if (type === 'template') {
		templateSelected.value = item as Template;
		templates.value = [];
	}
};

const searchTemplates = async () => {
	const { data, error } = await client
		.from('templates')
		.select('*')
		.ilike('name', `%${templateInput.value}%`);
	if (error) {
		console.log(error);
		return;
	}
	console.log(data);
	// @ts-ignore
	templates.value = data;
};

const searchLeads = async (action: 'search' | 'toggle') => {
	if (action === 'toggle') {
		showLeads.value = !showLeads.value;
		return;
	} else {
		let query = client.from('leads').select('*').eq('texted', false);

		if (radios.value[0].selected !== 'all') {
			query = query.eq('leadProvider', radios.value[0].selected);
		}
		if (radios.value[1].selected !== 'all') {
			query = query.eq('leadType', radios.value[1].selected);
		}

		const { data, error } = await query;
		if (error) {
			console.log(error);
			return;
		}
		console.log(data);
		// @ts-ignore
		leads.value = data;
		showLeads.value = true;
	}
};

const sendTexts = async () => {
	if (leads.value.length === 0) {
		alert('Please select leads to send messages to');
		return;
	}
	if (templateSelected.value && !templateSelected.value.message) {
		alert('Please select a template with a message');
		return;
	}
	uiStore.toggleFunctionLoading(true);
	try {
		const { data, error } = await $fetch('/api/bulk-send-messages', {
			method: 'POST',
			body: {
				leads: leads.value,
				message: templateSelected.value
					? templateSelected.value.message
					: message.value,
				user_id: leads.value[0].user_id,
			},
		});
	} catch (error) {
		console.log(error);
	} finally {
		uiStore.toggleFunctionLoading(false);
	}
};
</script>
