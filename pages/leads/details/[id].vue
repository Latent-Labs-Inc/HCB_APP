<template>
	<div>
		<h3 class="header">Lead Details</h3>
		<div class="grid sm:grid-cols-3 lg:grid-cols-4 gap-6 p-10">
			<p>Property Address: {{ leadDetails.propertyAddress.address1 }}</p>
			<p>Property City: {{ leadDetails.propertyAddress.city }}</p>
			<p>Property State: {{ leadDetails.propertyAddress.state }}</p>
			<p>Property Zip: {{ leadDetails.propertyAddress.zip }}</p>
			<p>
				Property County:
				{{
					!!leadDetails.propertyAddress.county
						? leadDetails.propertyAddress.county
						: "No County Saved"
				}}
			</p>
			<p>Lead Type: {{ leadDetails.leadType }}</p>
			<p>Lead Provider: {{ leadDetails.leadProvider }}</p>
			<p>Owner First Name: {{ leadDetails.ownerFirstName }}</p>
			<p>Owner Last Name: {{ leadDetails.ownerLastName }}</p>
			<p>Owner Address: {{ leadDetails.ownerAddress.address1 }}</p>
			<p>Owner City: {{ leadDetails.ownerAddress.city }}</p>
			<p>Owner State: {{ leadDetails.ownerAddress.state }}</p>
			<p>Owner Zip: {{ leadDetails.ownerAddress.zip }}</p>
			<p>Phone Numbers: {{ leadDetails.wireless }}</p>
			<p>Land Lines: {{ leadDetails.landline }}</p>
			<p>Emails: {{ leadDetails.email }}</p>
			<p>Has Texted: {{ leadDetails.texted ? "Yes" : "No" }}</p>
			<p>Has Mailed: {{ leadDetails.mailed ? "Yes" : "No" }}</p>
			<p>Has Emailed: {{ leadDetails.emailed ? "Yes" : "No" }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useLeadStore } from "~/stores/lead";
import { Lead } from "~/types/types";

const leadStore = useLeadStore();

const route = useRoute();

const leadId = ref(route.params.id as string);

const leadDetails = ref((await leadStore.fetchLeadById(leadId.value)) as Lead);

const keys = ref([
	"propertyAddress",
	"ownerFirstName",
	"ownerLastName",
	"email",
	"wireless",
]);
</script>
