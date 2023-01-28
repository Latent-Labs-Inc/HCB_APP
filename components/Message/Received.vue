<template>
	<div>
		<div class="flex flex-col justify-center items-center">
			<div class="flex justify-center pb-8">
				<div class="flex gap-4 justify-center pt-4 items-center">
					<label for="">Messages By Phone Number</label>
					<input class="py-1 px-3" v-model.trim="searchInput" type="text" />
					<button @click="handleSearch">Search</button>
				</div>
			</div>
			<UiTable
				class=""
				:cols="uiStore.width < 440 ? mobileCols : cols"
				:grid-cols="uiStore.width < 440 ? 'grid-cols-3' : 'grid-cols-5'"
				:dropdown-items="dropdownItems"
				:table-data="tableData"
				:properties="uiStore.width < 440 ? mobileProperties : properties"
				@item-clicked="handleItemClick"
				:key="forceUpdate"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useMessageStore } from '~/stores/message';
import { IncomingMessage, Lead } from '~/types/types';
import { useUiStore } from '~/stores/ui';
import { useLeadStore } from '~~/stores/lead';

const searchInput = ref('+1');
const messageStore = useMessageStore();
const leadStore = useLeadStore();
const router = useRouter();
const uiStore = useUiStore();

const cols = ref(['Property Address', 'Phone Number', 'Last Message', 'Date']);

const mobileCols = ref(['Last Message', 'Phone Number']);
const mobileProperties = ref(['message', 'from', 'dropdown']);

const properties = ref([
	'propertyAddress.address1',
	'from',
	'message',
	'sent_at',
	'dropdown',
]);

const dropdownItems = ref([
	{ id: 'view', label: 'View Lead Info' },
	{ id: 'reply', label: 'Reply' },
	{ id: 'delete', label: 'Delete Message' },
	{ id: 'favorite', label: 'Favorite' },
]);

const tableData = ref([] as IncomingMessage[]);

const setTableData = async () => {
	uiStore.toggleFunctionLoading(true);
	const messages: IncomingMessage[] = await messageStore.fetchMessages();
	messages.forEach((message) => {
		let regex = /stop|no|harassment|fuck/gi;

		if (!message.message.match(regex)) {
			tableData.value.push(message);
		}
	});

	tableData.value.forEach((msg) => {
		msg.sent_at = new Date(msg.sent_at).toLocaleDateString('en-us', {});
	});
	uiStore.toggleFunctionLoading(false);
};

onMounted(async () => {
	await setTableData();
});

const forceUpdate = ref(0);

watch(tableData, () => {
	console.log('tableData changed');
	forceUpdate.value++;
});

const handleItemClick = (item, row) => {
	console.log(item, row);
	if (item.id === 'view') {
		router.push(`/leads/details/${row.lead_id}`);
	} else if (item.id === 'reply') {
		leadStore.setSelectedLeadId(row.lead_id);
		router.push(`/leads/details/reply/${row.from}`);
	} else if (item.id === 'favorite') {
		leadStore.favorite(row.lead_id, row.from);
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
