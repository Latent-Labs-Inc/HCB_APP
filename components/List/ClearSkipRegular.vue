<template>
	<div>
		<UiBaseList
			:data="data"
			:grid-cols="gridCols"
			:colKeyPairs="colKeyPairs"
			:flip="true"
			itemName="Clear Skip Regular"
		/>
	</div>
</template>

<script setup lang="ts">
import { ClearSkipRegular } from '~~/types/types';

const props = defineProps<{
	data: ClearSkipRegular[];
}>();

console.log(props.data);

const gridCols = 'grid-cols-4';
const colKeyPairs = reactive({
	'First Name': 'input_first_name',
	'Last Name': 'input_last_name',
	Address: 'property_address',
	Zip: 'property_zip',
});
</script>

<style scoped></style>
