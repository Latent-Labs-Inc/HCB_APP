<template>
	<div
		class="grid grid-cols-4"
		v-if="input.insurance.benefitsInformation?.length > 0"
	>
		<div v-for="(benefit, index) in input.insurance.benefitsInformation">
			<p>Plan {{ index + 1 }}</p>
			<p>{{ benefit.name }}</p>
			<p>{{ benefit.planCoverage }}</p>
		</div>
		<div v-for="(status, index) in input.insurance.planStatus">
			<p>Plan {{ index + 1 }}</p>
			<p>{{ status.planDetails }}</p>
			<p>{{ status.status }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { PatientInput } from "~/types/types";

const props = defineProps<{ input: PatientInput }>();
</script>

<style scoped>
p {
	@apply text-center mb-2 text-sm;
}
</style>
