<template>
	<div>
		<div class="flex flex-col gap-8">
			<h3 class="header">Delete Leads</h3>
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
					<input type="text" v-model="otherLeadTypeInput" />
				</div>
			</transition>
			<div>
				<p class="mx-auto text-center mb-5 text-lg">Marketed</p>
				<UiRadio v-model.trim="marketed" :radio-types="marketedTypes" />
			</div>
		</div>
		<div class="my-12 flex justify-center">
			<button class="reverse" @click="removeLeads">Delete Leads</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useLeadStore } from "~/stores/lead";
import { useUiStore } from "~/stores/ui";
import { useAuthStore } from "~~/stores/auth";
import { Filter } from "~/types/types";

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

const otherLeadTypeInput = ref("");

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

const marketedTypes = [
	{
		label: "All",
		id: "all",
	},
	{
		label: "Texted",
		id: "texted",
	},
	{
		label: "Emailed",
		id: "emailed",
	},
	{
		label: "Mailed",
		id: "mailed",
	},
];
const marketed = ref("all");

const removeLeads = async () => {
	let filters = [] as Filter[];
	if (leadProvider.value !== "all") {
		filters.push({
			field: "leadProvider",
			operator: "eq",
			value:
				leadProvider.value === "other"
					? otherProviderInput.value
					: leadProvider.value,
		});
	}
	if (leadType.value !== "all") {
		filters.push({
			field: "leadType",
			operator: "eq",
			value:
				leadType.value === "other" ? otherLeadTypeInput.value : leadType.value,
		});
	}
	if (marketed.value !== "all") {
		filters.push({
			field: marketed.value,
			operator: "eq",
			value: true,
		});
	}
	console.log(filters);
	// const res = await leadStore.removeLeads(filters);
};
</script>
