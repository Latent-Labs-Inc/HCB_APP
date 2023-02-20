<template>
	<div>
		<h3 class="header">Home</h3>
		<!-- <div class="flex my-4">
			<button class="mx-auto" @click="testPuppeteer">Test Puppeteer</button>
		</div> -->
		<div class="grid gap-6">
			<div class="grid gap-4 justify-center lg:grid-cols-2">
				<LeadBarChart
					class=""
					:chart-data="leadData"
					:chart-options="leadOptions"
					:chart-id="'LeadsTotal'"
					:dataset-id-key="leadId"
					:height="300"
				/>
				<LeadBarChart
					class=""
					:chart-data="chartData"
					:chart-options="chartOptions"
					:chart-id="'LeadsMarketed'"
					:dataset-id-key="datasetIdKey"
					:height="300"
				/>
			</div>
			<div class="">
				<p class="text-2xl text-center">Received Messages</p>
				<MessageReceived />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useUiStore } from '~/stores/ui';

const uiStore = useUiStore();

const { chartData, chartOptions, datasetIdKey } = await useChartDataMarketed();

const {
	chartData: leadData,
	chartOptions: leadOptions,
	datasetIdKey: leadId,
} = await useChartDataLeads();

const testPuppeteer = async () => {
	const { data, error } = await $fetch('/api/puppeteer/flip-list', {
		method: 'GET',
	});
	console.log(data, error);
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
