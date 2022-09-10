<template>
	<div>
		<h3 class="header">Home</h3>
		<!-- <LeadBarChart
			:chart-data="chartData"
			:chart-options="chartOptions"
			:chart-id="'Leads'"
			:dataset-id-key="datasetIdKey"
		/> -->
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

const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
};

const chartData = {
	labels: ["Fiverr", "Blue", "Yellow", "Green", "Purple", "Orange"],
	datasets: [
		{
			label: "Total Leads Marketed",
			data: [10, 20, 30, 40, 50, 60],
			backgroundColor: [
				"rgba(255, 99, 132)",
				"rgba(54, 162, 235, 0.2)",
				"rgba(255, 206, 86, 0.2)",
				"rgba(75, 192, 192, 0.2)",
				"rgba(153, 102, 255, 0.2)",
				"rgba(255, 159, 64, 0.2)",
			],
		},
	],
};

const datasetIdKey = "Leads";

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
