<template>
	<div>
		<h3 class="header">Favorites</h3>
		<div>
			<UiTable
				:cols="uiStore.width < 440 ? mobileCols : cols"
				:grid-cols="uiStore.width < 440 ? 'grid-cols-3' : 'grid-cols-6'"
				:dropdown-items="dropdownItems"
				:table-data="leads"
				:properties="uiStore.width < 440 ? mobileProperties : properties"
				@item-clicked="handleItemClick"
				:key="forceUpdate"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useLeadStore } from "~/stores/lead";
import { useUiStore } from "~/stores/ui";
import { Lead } from "~~/types/types";

const leadStore = useLeadStore();
const router = useRouter();
const uiStore = useUiStore();

const leads = ref([] as Lead[]);
const mobileCols = ref(["Property Address", "Phone"]);
const mobileProperties = ref([
	"propertyAddress.address1",
	"favoritePhone",
	"dropdown",
]);
const cols = ref([
	"Property Address",
	"Property Zip",
	"First Name",
	"LastName",
	"Phone",
]);

const properties = ref([
	"propertyAddress.address1",
	"propertyAddress.zip",
	"ownerFirstName",
	"ownerLastName",
	"favoritePhone",
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
	{
		label: "View Details",
		id: "details",
	},
] as Item[]);

const handleItemClick = (item: Item, lead) => {
	if (item.id === "unfavorite") {
		leadStore.unfavorite(lead.lead_id);
	} else if (item.id === "reply") {
		router.push(`/leads/details/reply/${lead.favoritePhone}`);
	} else if (item.id === "details") {
		router.push(`/leads/details/${lead.lead_id}`);
	}
};

onMounted(async () => {
	const favoriteLeads: Lead[] = await leadStore.getFavorites();
	leads.value = favoriteLeads;
	forceUpdate.value++;
});

const forceUpdate = ref(0);

watch(leads.value, (newValue, oldValue) => {
	forceUpdate.value++;
});
</script>
