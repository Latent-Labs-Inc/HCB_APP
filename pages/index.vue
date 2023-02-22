<template>
	<div>
		<h3 class="header">Home</h3>
		<div class="flex my-4">
			<button class="mx-auto" @click="testPuppeteer">Test Puppeteer</button>
		</div>
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
import puppeteer from 'puppeteer-core';

const uiStore = useUiStore();

const { chartData, chartOptions, datasetIdKey } = await useChartDataMarketed();

const {
	chartData: leadData,
	chartOptions: leadOptions,
	datasetIdKey: leadId,
} = await useChartDataLeads();

const testPuppeteer = async () => {
	try {
		const browser = await puppeteer.launch({
			executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
			headless: true,
		});

		const page = await browser.newPage();
		await page.goto('https://www.google.com');

		// Take a screenshot to verify that the page was loaded correctly
		await page.screenshot({ path: 'screenshot.png' });

		await browser.close();
	} catch (error) {
		console.log(error);
	}
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
