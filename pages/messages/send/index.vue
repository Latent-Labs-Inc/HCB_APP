<template>
	<div>
		<div class="flex flex-col gap-8">
			<h3 class="header">Send Messages</h3>
			<transition name="fade" mode="out-in">
				<div class="flex flex-col gap-8" v-if="sentMessages === 0">
					<div>
						<p class="mx-auto text-center mb-5 text-lg">Lead Provider Type</p>
						<UiRadio v-model.trim="leadProvider" :radio-types="providerTypes" />
					</div>
					<transition name="fade" mode="out-in">
						<div
							class="flex justify-center gap-4"
							v-if="leadProvider === 'other'"
						>
							<label for="">Other: </label>
							<input type="text" v-model="otherProviderInput" />
						</div>
					</transition>
					<div class="">
						<p class="mx-auto text-center mb-5 text-lg">Lead Type</p>
						<UiRadio v-model.trim="leadType" :radio-types="leadTypes" />
					</div>
					<transition name="fade" mode="out-in">
						<div class="flex justify-center gap-4" v-if="leadType === 'other'">
							<label for="">Other: </label>
							<input type="text" v-model="otherTypeInput" />
						</div>
					</transition>
					<transition name="fade" mode="out-in">
						<div v-if="!templateSelected.template_id">
							<div class="">
								<p class="mx-auto text-center mb-5 text-lg">Use Template?</p>
								<UiRadio
									v-model.trim="isTemplate"
									:radio-types="templateRadio"
								/>
							</div>
							<MessageTemplateSearch
								v-if="isTemplate === 'yes'"
								:isTemplate="isTemplate"
								:useTable="useTable"
								@selected="handleSelected"
							/>
						</div>
						<div v-else class="flex flex-col gap-4">
							<p>Selected Message: {{ templateSelected.message }}</p>
							<button class="mx-auto" @click="handleChange">
								Change Message
							</button>
						</div>
					</transition>
					<div class="">
						<MessageSend
							@send="handleMessage"
							:usingTemplate="isTemplate === 'no' ? true : false"
						/>
					</div>
				</div>
				<div class="flex flex-col gap-8" v-else>
					<div class="flex flex-col gap-8">
						<p class="text-xl text-center">Sent {{ sentMessages }} Messages</p>
						<p class="text-xl text-center">
							Lead Provider:
							{{ leadProvider === 'other' ? otherProviderInput : leadProvider }}
						</p>
						<p class="text-xl text-center">
							Lead Type: {{ leadType === 'other' ? otherTypeInput : leadType }}
						</p>
					</div>
					<button @click="handleContinue">Send More</button>
				</div>
			</transition>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Template } from '~~/types/types';
import { useLeadStore } from '~/stores/lead';
import { useUiStore } from '~/stores/ui';
import { useAuthStore } from '~~/stores/auth';

const authStore = useAuthStore();
const leadStore = useLeadStore();
const uiStore = useUiStore();
const router = useRouter();

const leadProvider = ref('all');
const isTemplate = ref('no');
const templateRadio = ref([
	{ label: 'Yes', id: 'yes' },
	{ label: 'No', id: 'no' },
]);
const useTable = ref(false);

const otherProviderInput = ref('');

const providerTypes = [
	{
		label: 'All',
		id: 'all',
	},
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

const leadType = ref('all');

const templateSelected = ref({} as Template);

const otherTypeInput = ref('');
const sentMessages = ref<number>(0);

const leadTypes = [
	{
		label: 'All',
		id: 'all',
	},
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

const msgInvalid = ref(false);

const handleMessage = async (event) => {
	const message =
		isTemplate.value === 'yes' ? templateSelected.value.message : event;
	console.log(message);
	if (!!message) {
		uiStore.toggleFunctionLoading(true);
		const res = await $fetch('/api/message-leads', {
			method: 'POST',
			body: {
				message: !!message ? message : null,
				leadProvider: leadProvider.value,
				otherProvider: !!otherProviderInput.value
					? otherProviderInput.value
					: null,
				leadType: leadType.value,
				otherType: !!otherTypeInput.value ? otherTypeInput.value : null,
				user_id: authStore.user_id,
			},
		});

		console.log(res);

		uiStore.toggleFunctionLoading(false);

		sentMessages.value = res.messageCounter;

		// router.push("/messages");
	} else {
		msgInvalid.value = true;
	}
};

const handleContinue = () => {
	sentMessages.value = 0;
};

watch(leadProvider, (newType) => {
	if (newType === 'other') {
		leadStore.setLeadProvider(otherProviderInput.value);
	} else {
		leadStore.setLeadProvider(newType);
	}
});

watch(leadType, (newType) => {
	if (newType === 'other') {
		leadStore.setLeadType(otherTypeInput.value);
	} else {
		leadStore.setLeadType(newType);
	}
});

const handleSelected = (template: Template) => {
	templateSelected.value = template;
};

const handleChange = async () => {
	templateSelected.value = {} as Template;
};
</script>
