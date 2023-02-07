<template>
	<UiBaseList
		:data="data"
		:gridCols="'grid-cols-5'"
		:colKeyPairs="leadColKeyPairs"
		:showAdd="false"
		:itemName="'Lead'"
		:flip="true"
		@selected="handleSelected('lead', $event)"
	/>
</template>

<script setup lang="ts">
import { Lead } from '~~/types/types';
const props = defineProps<{
	data: Lead[];
}>();

const leadColKeyPairs = reactive({
	'Lead Provider': 'leadProvider',
	'Lead Type': 'leadType',
	Address: 'propertyAddress.address1',
	City: 'propertyAddress.city',
	'Phone Numbers': 'wireless',
});

const emits = defineEmits<{
	selected: (type: string, selected: Lead) => void;
}>();

const handleSelected = (type: string, selected: Lead) => {
	emits.selected(type, selected);
};
</script>

<style scoped></style>
