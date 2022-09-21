<template>
	<div>
		<div class="flex flex-col justify-center items-center">
			<div class="flex justify-center">
				<UiSearchInline
					v-model="searchInput"
					:label="'Messages By Phone Number'"
					@search="handleSearch"
				/>
			</div>
			<UiTable
				class=""
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
import { IncomingMessage, Lead } from "~/types/types";
import { useUiStore } from "~/stores/ui";
import { useLeadStore } from "~~/stores/lead";

const searchInput = ref("+1");
const messageStore = useMessageStore();
const leadStore = useLeadStore();
const router = useRouter();
const uiStore = useUiStore();

const cols = ref(["Property Address", "Phone Number", "Last Message", "Date"]);

const properties = ref([
	"object.propertyAddress.address1",
	"from",
	"message",
	"sent_at",
	"dropdown",
]);

const dropdownItems = ref([
	{ id: "view", label: "View Lead Info" },
	{ id: "reply", label: "Reply" },
	{ id: "delete", label: "Delete Message" },
	{ id: "favorite", label: "Favorite" },
]);

const tableData = ref([] as IncomingMessage[]);

const setTableData = async () => {
	uiStore.toggleFunctionLoading(true);
	tableData.value = await messageStore.fetchMessages();

	tableData.value.forEach((msg) => {
		msg.sent_at = new Date(msg.sent_at).toLocaleString();
	});
	uiStore.toggleFunctionLoading(false);
};

onMounted(async () => {
	await setTableData();
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
	} else if (item.id === "reply") {
		leadStore.setSelectedLeadId(row.lead_id);
		router.push(`/leads/details/reply/${row.from}`);
	} else if (item.id === "favorite") {
		leadStore.favorite(row.lead_id);
	}
};

const handleSearch = async () => {
	uiStore.toggleFunctionLoading(true);
	const messages = await messageStore.fetchByPhone(searchInput.value);
	tableData.value = messages;
	tableData.value.forEach((msg) => {
		msg.sent_at = new Date(msg.sent_at).toLocaleString();
	});
	uiStore.toggleFunctionLoading(false);
};
</script>
