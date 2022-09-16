<template>
	<div>
		<div class="flex flex-col gap-8">
			<h3 class="header">Select Lead Types</h3>
			<div class="">
				<p class="mx-auto text-center mb-5 text-lg">Lead Provider Type</p>
				<UiRadio v-model.trim="leadProvider" :radio-types="providerTypes" />
			</div>
			<transition name="fade" mode="out-in">
				<div class="flex justify-center gap-4" v-if="leadProvider === 'other'">
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
		</div>
		<div class="my-2">
			<MessageSend @send="handleMessage" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { useLeadStore } from "~/stores/lead";
import { useUiStore } from "~/stores/ui";
import { useAuthStore } from "~~/stores/auth";

const authStore = useAuthStore();
const leadStore = useLeadStore();
const uiStore = useUiStore();
const router = useRouter();

const leadProvider = ref("all");

const otherProviderInput = ref("");

const providerTypes = [
	{
		label: "All",
		id: "all",
	},
	{
		label: "PropStream",
		id: "propStream",
	},
	{
		label: "Foreclosure Daily",
		id: "foreclosureDaily",
	},
	{
		label: "Fiverr",
		id: "fiverr",
	},
	{
		label: "Other",
		id: "other",
	},
];

const leadType = ref("all");

const otherTypeInput = ref("");

const leadTypes = [
	{
		label: "All",
		id: "all",
	},
	{
		label: "Foreclosure",
		id: "foreclosure",
	},
	{
		label: "Probate",
		id: "probate",
	},
	{
		label: "Divorce",
		id: "divorce",
	},
	{
		label: "High Equity",
		id: "highEquity",
	},
	{
		label: "Other",
		id: "other",
	},
];

const msgInvalid = ref(false);

const handleMessage = async ($event) => {
	const message = $event;

	if (!!message) {
		uiStore.toggleFunctionLoading(true);
		const res = await $fetch("/api/message-leads", {
			method: "POST",
			body: {
				message: !!message ? message : null,
				leadProvider: leadProvider.value,
				otherProvider: !!otherProviderInput.value ? otherProviderInput.value : null,
				leadType: leadType.value,
				otherType: !!otherTypeInput.value ? otherTypeInput.value : null,
				user_id: authStore.user_id,
			},
		});

		console.log(res);

		uiStore.toggleFunctionLoading(false);
		router.push("/messages");
	} else {
		msgInvalid.value = true;
	}
};

watch(leadProvider, (newType) => {
	if (newType === "other") {
		leadStore.setLeadProvider(otherProviderInput.value);
	} else {
		leadStore.setLeadProvider(newType);
	}
});

watch(leadType, (newType) => {
	if (newType === "other") {
		leadStore.setLeadType(otherTypeInput.value);
	} else {
		leadStore.setLeadType(newType);
	}
});
</script>
