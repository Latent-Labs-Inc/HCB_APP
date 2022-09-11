<template>
	<div>
		<h3 class="header">Home</h3>
		<LeadBarChart
			:chart-data="leadData"
			:chart-options="leadOptions"
			:chart-id="'LeadsTotal'"
			:dataset-id-key="leadId"
			:height="300"
		/>
		<LeadBarChart
			class="mt-20"
			:chart-data="chartData"
			:chart-options="chartOptions"
			:chart-id="'LeadsMarketed'"
			:dataset-id-key="datasetIdKey"
			:height="300"
		/>
		<!-- <UiTable
			:cols="cols"
			:gridCols="gridCols"
			:tableData="tableData"
			:properties="properties"
			:dropdownItems="dropdownItems"
			@itemClicked="handleItemClick"
			:pageLength="10"
		/> -->
	</div>
</template>

<script setup lang="ts">
await useLoadContent();

const { $supabase } = useNuxtApp();

const { chartData, chartOptions, datasetIdKey } = await useChartDataMarketed();

const {
	chartData: leadData,
	chartOptions: leadOptions,
	datasetIdKey: leadId,
} = await useChartDataLeads();

// const cols = ref(["Name", "Email", "Phone", "Order", "Patient"]);

// const gridCols = ref("grid-cols-6");

// const tableData = ref([
// 	{
// 		name: "John Doe",
// 		email: "jimm@jimmm",
// 		phone: "",
// 		order: "",
// 		patient: "",
// 	},
// 	{
// 		name: "John Doe",
// 		email: "jimm@jimmm",
// 		phone: "",
// 		order: "",
// 		patient: "",
// 	},
// 	{
// 		name: "John Doe",
// 		email: "jimm@jimmm",
// 		phone: "",
// 		order: "",
// 		patient: "",
// 	},
// 	{
// 		name: "John Doe",
// 		email: "jimm@jimmm",
// 		phone: "",
// 		order: "",
// 		patient: "",
// 	},
// 	{
// 		name: "John Doe",
// 		email: "jimm@jimmm",
// 		phone: "",
// 		order: "",
// 		patient: "",
// 	},
// 	{
// 		name: "John Doe",
// 		email: "jimm@jimmm",
// 		phone: "",
// 		order: "",
// 		patient: "",
// 	},
// 	{
// 		name: "John Doe",
// 		email: "jimm@jimmm",
// 		phone: "",
// 		order: "",
// 		patient: "",
// 	},
// 	{
// 		name: "John Doe",
// 		email: "jimm@jimmm",
// 		phone: "",
// 		order: "",
// 		patient: "",
// 	},
// ]);
// const properties = ref([
// 	"name",
// 	"email",
// 	"phone",
// 	"order",
// 	"patient",
// 	"dropdown",
// ]);
// const dropdownItems = ref([
// 	{
// 		id: "1",
// 		label: "Edit",
// 	},
// 	{
// 		id: "2",
// 		label: "Delete",
// 	},
// ]);

// const handleItemClick = (item, row) => {
// 	console.log(item, row);
// };
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
