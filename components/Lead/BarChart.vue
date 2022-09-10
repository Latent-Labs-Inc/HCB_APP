<template>
	<div>
		<Bar
			:chart-options="chartOptions"
			:chart-data="chartData"
			:chart-id="chartId"
			:dataset-id-key="datasetIdKey"
			:css-classes="cssClasses"
			:styles="styles"
			:width="width"
			:height="height"
		/>
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

const props = defineProps<{
	chartOptions?: {
		responsive?: boolean;
		maintainAspectRatio?: boolean;
		plugins?: {
			legend: {
				display: boolean;
			};
			title?: {
				display: boolean;
				text: string;
			};
		};
	};
	chartData: {
		labels: string[];
		datasets: {
			label: string;
			data: number[];
			backgroundColor: string[];
		}[];
	};
	chartId: string;
	datasetIdKey: string;
	cssClasses?: string;
	styles?: string;
	width?: number;
	height?: number;
}>();
</script>
