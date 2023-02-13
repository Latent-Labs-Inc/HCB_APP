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
import { ClearSkipProbate } from '~~/types/types';

const props = defineProps<{
	data: ClearSkipProbate[];
}>();

const gridCols = 'grid-cols-4';
const colKeyPairs = reactive({
	'First Name': 'input_first_name',
	'Last Name': 'input_last_name',
	Address: 'input_address_1',
	Zip: 'input_zip_code',
});
</script>

<style scoped></style>
