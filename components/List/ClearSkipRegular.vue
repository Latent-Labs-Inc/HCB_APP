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
import { ClearSkipRegular } from '~~/types/types';

const props = defineProps<{
	data: ClearSkipRegular[];
}>();

const gridCols = 'grid-cols-4';
const colKeyPairs = reactive({
	'First Name': 'pr_first_name',
	'Last Name': 'pr_last_name',
	Address: 'address',
	Zip: 'zip',
});
</script>

<style scoped></style>
