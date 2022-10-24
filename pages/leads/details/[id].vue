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
						Property {{ key.toTitle() }} :
						{{ leadDetails.propertyAddress[key] }}
					</p>
					<p v-else-if="index + 1 >= 10 && index + 1 <= 13">
						Mailing {{ key.toTitle() }} :
						{{ leadDetails.mailingAddress[key] }}
					</p>
					<p v-else>{{ key.camel2title() }}: {{ leadDetails[key] }}</p>
				</div>
			</div>
			<div v-if="!!leadDetails?.favoritePhone" class="flex mt-4">
				<button @click="handleReply" class="mx-auto px-12">Reply</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useLeadStore } from "~/stores/lead";
import { Lead } from "~/types/types";

const router = useRouter();
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
	"address1",
	"city",
	"state",
	"zip",
	"wireless",
	"landline",
	"email",
	"texted",
	"mailed",
	"emailed",
]);

const fetchLeadDetails = async () => {
	leadDetails.value = await leadStore.fetchLeadById(leadId.value);
};
onMounted(async () => {
	await fetchLeadDetails();
});

const handleReply = () => {
	leadStore.setSelectedLeadId(leadId.value);
	router.push(`/leads/details/reply/${leadDetails.value.favoritePhone}`);
};
</script>
