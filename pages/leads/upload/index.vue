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
					<input type="text" />
				</div>
			</transition>
			<div class="my-6">
				<UiRadio v-model="leadType" :radio-types="radioTypes" />
			</div>
			<transition name="fade" mode="out-in">
				<div class="flex justify-center gap-4" v-if="leadType === 'other'">
					<label for="">Other: </label>
					<input type="text" />
				</div>
			</transition>
			<div>
				<UiImporter :label="'Leads'" :composable="useFormattedLeads" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useLeadStore } from "~/stores/lead";
const leadProvider = ref("propStream");

const providerTypes = [
	{
		label: "PropStream",
		id: "propStream",
	},
	{
		label: "Foreclosure Daily",
		id: "foreclosureDaily",
	},
	{
		label: "Other",
		id: "other",
	},
];

const leadStore = useLeadStore();

watch(leadProvider, (newType) => {
	leadStore.setLeadProvider(newType);
});
</script>
