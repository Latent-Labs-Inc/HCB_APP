<template>
	<div>
		<UiBaseList
			:colKeyPairs="colKeyPairs"
			:data="data"
			gridCols="grid-cols-5"
			itemName="'Attorney'"
			:flip="true"
		/>
	</div>
</template>

<script setup lang="ts">
import { FormattedProbates } from '~~/types/types';

const props = defineProps<{
	data: FormattedProbates[];
}>();
const colKeyPairs = reactive({
	'Attorney Email': 'attorney_email',
	'Property Address': 'address1',
	'Property City': 'city',
	'Property State': 'state',
	'Property Zip': 'zip',
});
</script>

<style scoped></style>
