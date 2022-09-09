<template>
	<div>
		<Bar
			:chart-options="chartOptions"
			:chart-data="chartData"
			:chart-id="chartId"
			:dataset-id-key="datasetIdKey"
		/>
		<!-- :css-classes="cssClasses" :styles="styles" :width="width" :height="height" -->
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
</script>
