<template>
	<div>
		<h3 class="header">Messages</h3>
		<div>
			<div class="flex justify-center">
				<UiSearchInline v-model="searchInput" :label="'Contacts'" />
			</div>
			<UiTable
				:cols="cols"
				:grid-cols="'grid-cols-5'"
				:dropdown-items="dropdownItems"
				:table-data="tableData"
				:properties="properties"
				@item-clicked="handleItemClick"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
const searchInput = ref("");

const cols = ref(["Name", "Phone Number", "Last Message", "Date"]);
const properties = ref(["name", "phone", "lastMessage", "date", "dropdown"]);
const dropdownItems = ref([
	{ id: "message", label: "Message" },
	{ id: "view", label: "View Contact Info" },
	{ id: "delete", label: "Delete Contact" },
]);

const tableData = ref([]);

const handleItemClick = (item, row) => {
	console.log(item, row);
};
</script>
