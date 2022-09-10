<template>
	<div>
		<h3 class="header">Home</h3>
		<LeadBarChart
			:chart-data="chartData"
			:chart-options="chartOptions"
			:chart-id="'Leads'"
			:dataset-id-key="datasetIdKey"
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

const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
};

const { $supabase } = useNuxtApp();

const { data: fiverrLeads } = await $supabase
	.from("leads")
	.select("*")
	.eq("texted", true)
	.eq("leadType", "fiverr");

const { data: propStreamLeads } = await $supabase
	.from("leads")
	.select("*")
	.eq("texted", true)
	.eq("leadType", "propStream");

const { data: foreclosureDailyLeads } = await $supabase
	.from("leads")
	.select("*")
	.eq("texted", true)
	.eq("leadType", "foreclosureDaily");

const { data: otherLeads } = await $supabase
	.from("leads")
	.select("*")
	.eq("texted", true)
	.eq("leadType", "other");

const chartData = {
	labels: ["Fiverr", "ForeclosureDaily", "PropStream", "Other"],
	datasets: [
		{
			label: "Total Leads Marketed",
			data: [
				fiverrLeads?.length,
				foreclosureDailyLeads?.length || 15,
				propStreamLeads?.length,
				otherLeads?.length,
			],
			backgroundColor: [
				"rgba(2, 173, 36, .9)",
				"rgba(2, 173, 36, 0.9)",
				"rgba(2, 173, 36, 0.9)",
				"rgba(2, 173, 36, 0.9)",
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
