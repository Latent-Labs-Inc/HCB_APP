<template>
	<div>
		<h3 class="header">Lead Details</h3>
		<div class="grid-cols-5 gap-4">
			<div v-for="key in leadDetails">{{ leadDetails[key] }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useLeadStore } from "~/stores/lead";

const leadStore = useLeadStore();

const route = useRoute();

const leadDetails = await leadStore.getLeadById(route.params.id as string);
</script>
