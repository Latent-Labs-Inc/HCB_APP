<template>
	<div>
		<h3 class="header">Favorites</h3>
		<div>
			<UiTable
				:cols="cols"
				:grid-cols="'grid-cols-5'"
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

const leads = ref([] as Lead[]);
const cols = ref(["Property Address", "Property Zip", "Name", "Phone"]);

const properties = ref([
	"object.propertyAddress.address1",
	"object.propertyAddress.zip",
	"name",
	"phone",
]);
const dropdownItems = ref([
	{
		label: "Unfavorite",
		id: "unfavorite",
	},
	{
		label: "Reply",
		id: "reply",
	},
]);

const handleItemClick = (lead: Lead, action: string) => {
	if (action === "unfavorite") {
		leadStore.unfavoriteLead(lead.lead_id);
	}
};

onMounted(async () => {
	leads.value = await leadStore.getFavorites();
});
</script>
