<template>
	<div>
		<h3 class="header">Favorites</h3>
		<div>
			<UiTable
				:cols="cols"
				:grid-cols="'grid-cols-6'"
				:dropdown-items="dropdownItems"
				:table-data="leads"
				:properties="properties"
				@item-clicked="handleItemClick"
				:key="forceUpdate"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useLeadStore } from "~/stores/lead";
import { Lead } from "~~/types/types";

const leadStore = useLeadStore();
const router = useRouter();

const leads = ref([] as Lead[]);
const cols = ref([
	"Property Address",
	"Property Zip",
	"First Name",
	"LastName",
	"Phone",
]);

const properties = ref([
	"object.propertyAddress.address1",
	"object.propertyAddress.zip",
	"ownerFirstName",
	"ownerLastName",
	"wireless",
	"dropdown",
]);

interface Item {
	label: string;
	id: string;
}

const dropdownItems = ref([
	{
		label: "Unfavorite",
		id: "unfavorite",
	},
	{
		label: "Reply",
		id: "reply",
	},
] as Item[]);

const handleItemClick = (item: Item, lead) => {
	if (item.id === "unfavorite") {
		leadStore.unfavorite(lead.lead_id);
	} else if (item.id === "reply") {
		router.push(`/leads/details/reply/${lead.wireless}`);
	}
};

onMounted(async () => {
	leads.value = await leadStore.getFavorites();
	console.log(leads.value);
	forceUpdate.value++;
});

const forceUpdate = ref(0);

watch(leads.value, (newValue, oldValue) => {
	forceUpdate.value++;
});
</script>
