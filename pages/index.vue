<template>
	<div>
		<h3 class="header">Home</h3>
		<div class="flex flex-col gap-6">
			<div
				class="flex gap-4 justify-evenly"
				:class="uiStore.width < 440 ? 'xs:flex-col' : ''"
			>
				<LeadBarChart
					class="sm:w-1/3 lg:w-2/5"
					:chart-data="leadData"
					:chart-options="leadOptions"
					:chart-id="'LeadsTotal'"
					:dataset-id-key="leadId"
					:height="300"
				/>
				<LeadBarChart
					class="sm:w-1/3 lg:w-2/5"
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
import { useUiStore } from "~/stores/ui";

await useLoadContent();

const uiStore = useUiStore();

const { $supabase } = useNuxtApp();

const { chartData, chartOptions, datasetIdKey } = await useChartDataMarketed();

const {
	chartData: leadData,
	chartOptions: leadOptions,
	datasetIdKey: leadId,
} = await useChartDataLeads();
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
