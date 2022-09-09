<template>
	<div>
		<h3 class="header">Home</h3>
		<Bar
			:chart-options="chartOptions"
			:chart-data="chartData"
			:chart-id="chartId"
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
import { Bar } from "vue-chartjs";
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale,
} from "chart.js";

ChartJS.register(
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale
);

const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
};

const chartData = {
	labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
	datasets: [{ data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] }],
};

const chartId = "myChart";

const datasetIdKey = "id";

await useLoadContent();

const cols = ref(["Name", "Email", "Phone", "Order", "Patient"]);

const gridCols = ref("grid-cols-6");

const tableData = ref([
	{
		name: "John Doe",
		email: "jimm@jimmm",
		phone: "",
		order: "",
		patient: "",
	},
	{
		name: "John Doe",
		email: "jimm@jimmm",
		phone: "",
		order: "",
		patient: "",
	},
	{
		name: "John Doe",
		email: "jimm@jimmm",
		phone: "",
		order: "",
		patient: "",
	},
	{
		name: "John Doe",
		email: "jimm@jimmm",
		phone: "",
		order: "",
		patient: "",
	},
	{
		name: "John Doe",
		email: "jimm@jimmm",
		phone: "",
		order: "",
		patient: "",
	},
	{
		name: "John Doe",
		email: "jimm@jimmm",
		phone: "",
		order: "",
		patient: "",
	},
	{
		name: "John Doe",
		email: "jimm@jimmm",
		phone: "",
		order: "",
		patient: "",
	},
	{
		name: "John Doe",
		email: "jimm@jimmm",
		phone: "",
		order: "",
		patient: "",
	},
]);
const properties = ref([
	"name",
	"email",
	"phone",
	"order",
	"patient",
	"dropdown",
]);
const dropdownItems = ref([
	{
		id: "1",
		label: "Edit",
	},
	{
		id: "2",
		label: "Delete",
	},
]);

const handleItemClick = (item, row) => {
	console.log(item, row);
};
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
