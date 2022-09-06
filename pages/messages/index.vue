<template>
	<div>
		<h3 class="header">Messages</h3>
		<div>
			<div class="flex justify-center">
				<UiSearchInline v-model="searchInput" :label="'Leads'" />
			</div>
			<UiTable
				:cols="cols"
				:grid-cols="'grid-cols-5'"
				:dropdown-items="dropdownItems"
				:table-data="tableData"
				:properties="properties"
				@item-clicked="handleItemClick"
				:key="forceUpdate"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useMessageStore } from "~/stores/message";
import { IncomingMessage } from "~/types/types";

const searchInput = ref("");
const messageStore = useMessageStore();
const router = useRouter();

const cols = ref(["Property Address", "Phone Number", "Last Message", "Date"]);

const properties = ref([
	"object.propertyAddress.address1",
	"from",
	"message",
	"sent_at",
	"dropdown",
]);

const dropdownItems = ref([
	{ id: "message", label: "Message" },
	{ id: "view", label: "View Lead Info" },
	{ id: "delete", label: "Delete Message" },
]);

const tableData = ref([] as IncomingMessage[]);

tableData.value = await messageStore.fetchMessages();

tableData.value.forEach((msg) => {
	msg.sent_at = new Date(msg.sent_at).toLocaleString();
});

const forceUpdate = ref(0);

watch(tableData, () => {
	console.log("tableData changed");
	forceUpdate.value++;
});

const handleItemClick = (item, row) => {
	console.log(item, row);
	if (item.id === "view") {
		router.push(`/leads/details/${row.lead_id}`);
	}
};
</script>
