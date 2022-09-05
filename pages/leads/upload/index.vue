<template>
	<div>
		<h3 class="header">Upload Leads</h3>
		<div class="flex flex-col gap-8">
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
const leadType = ref("propStream");

const radioTypes = [
	{
		label: "PropStream",
		id: "propStream",
	},
	{
		label: "Zillow",
		id: "zillow",
	},
	{
		label: "Other",
		id: "other",
	},
];
</script>
