<template>
	<div class="">
		<div class="">
			<h3 class="header">Lead Details</h3>
			<div
				class="ml-2 mx-auto grid sm:grid-cols-1 lg:grid-cols-2 gap-y-2"
				v-if="!!leadDetails"
			>
				<div v-for="(key, index) in keys">
					<p v-if="index + 1 <= 5">
						{{ key.toTitle() }} :
						{{ leadDetails.propertyAddress[key] }}
					</p>
					<p v-else>{{ key.camel2title() }}: {{ leadDetails[key] }}</p>
				</div>
			</div>
			<div class="grid sm:grid-cols-3 lg:grid-cols-4 gap-6 pl-10" v-else></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useLeadStore } from "~/stores/lead";
import { Lead } from "~/types/types";

String.prototype.toTitle = function () {
	return this.replace(/(^|\s)\S/g, function (t) {
		return t.toUpperCase();
	});
};

String.prototype.camel2title = function () {
	return this.replace(/([A-Z])/g, function (t) {
		return " " + t.toLowerCase();
	}).toTitle();
};

const leadStore = useLeadStore();

const route = useRoute();

const leadId = ref(route.params.id as string);

const leadDetails = ref(null as Lead);

const keys = ref([
	"address1",
	"city",
	"state",
	"zip",
	"county",
	"leadType",
	"leadProvider",
	"ownerFirstName",
	"ownerLastName",
	"ownerAddress.address1",
	"ownerAddress.city",
	"ownerAddress.state",
	"ownerAddress.zip",
	"wireless",
	"landline",
	"email",
	"texted",
	"mailed",
	"emailed",
]);

const fetchLeadDetails = async () => {
	console.log("leadId", leadId.value);
	leadDetails.value = await leadStore.fetchLeadById(leadId.value);
	console.log(leadDetails.value);
};
onMounted(async () => {
	await fetchLeadDetails();
});
</script>
