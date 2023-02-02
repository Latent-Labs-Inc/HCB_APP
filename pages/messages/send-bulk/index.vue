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
					<textarea v-model.trim="message" v-if="!radios[2].selected" />
					<div class="flex my-auto gap-4 justify-center" v-else>
						<label class="my-auto" for="">Search</label>
						<input class="py-0" type="text" />
						<p
							class="my-auto px-4 py-2 dark:bg-darkBg bg-primary rounded-lg cursor-pointer dark:hover:bg-darkPrimary hover:bg-primary trans"
							@click="searchLeads"
						>
							Search
						</p>
					</div>
				</transition>
				<button class="mx-auto reverse">Preview Leads</button>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
import { Template } from '~~/types/types';
import { Database } from '~/types/supabase';
import { useUiStore } from '~/stores/ui';
import { useAuthStore } from '~~/stores/auth';

const authStore = useAuthStore();
const uiStore = useUiStore();
const router = useRouter();
const client = useSupabaseClient<Database>();

const message = ref('');

const templateSelected = ref(null as Template | null);

const sentMessages = ref<number>(0);

const handleMessage = async () => {};

const handleContinue = () => {
	sentMessages.value = 0;
};

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
			{ value: 'eviction', label: 'Evictions' },
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
	console.log(index, value);
	radios.value[index].selected = value as string;
};

const handleSelected = (template: Template) => {
	templateSelected.value = template;
};

const handleChange = async () => {
	templateSelected.value = null;
};

const searchLeads = async () => {
	let query = client.from('leads').select('*');

	if (radios.value[0].selected !== 'all') {
		query = query.eq('leadProvider', radios.value[0].selected);
	}
	if (radios.value[1].selected !== 'all') {
		query = query.eq('leadType', radios.value[0].selected);
	}

	const { data, error } = await query;

	console.log(data, error);
};
</script>
