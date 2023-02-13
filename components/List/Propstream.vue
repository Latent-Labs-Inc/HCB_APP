<template>
	<div>
		<UiBaseList
			:data="data"
			:grid-cols="gridCols"
			:colKeyPairs="colKeyPairs"
			:flip="true"
			itemName="Clear Skip Probate"
		/>
	</div>
</template>

<script setup lang="ts">
import { PropSkipTrace } from '~~/types/types';

const props = defineProps<{
	data: PropSkipTrace[];
}>();

const gridCols = 'grid-cols-4';
const colKeyPairs = reactive({
	'First Name': 'first_name',
	'Last Name': 'last_name',
	Address: 'street_address',
	Zip: 'zip',
});
</script>

<style scoped></style>
