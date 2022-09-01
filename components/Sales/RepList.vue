<template>
	<div>
		<div class="flex flex-col my-2 w-11/12 mx-auto">
			<div class="text-primary dark:text-darkSecondary grid grid-cols-4 p-2">
				<div v-for="key in list">{{ key.toTitle() }}</div>
			</div>
			<div
				v-if="paginatedItems.length > 0"
				v-for="item in paginatedItems"
				:key="item"
				class="text-primary dark:text-darkSecondary grid grid-cols-4 rounded hover:bg-darkSecondary dark:hover:bg-darkBg w-full p-2 cursor-pointer trans"
				@click="emits('selected', item)"
			>
				<div v-for="key in list">{{ item[key] }}</div>
			</div>
			<div
				v-else
				class="text-primary dark:text-darkSecondary flex flex-col items-center justify-center rounded w-full p-2 my-12 text-lg gap-8 trans"
			>
				<p>No {{ itemName }}'s Found</p>
				<p class="btn reverse hover:cursor-pointer" @click="emits('add')">
					Click to Add {{ itemName }}
				</p>
			</div>
		</div>
		<div class="flex justify-center gap-2" v-if="checkItem">
			<p
				v-if="page > 1"
				class="rounded-3xl hover:bg-darkSecondary hover:cursor-pointer dark:hover:bg-black p-2 px-3"
				@click="backPage"
			>
				Back
			</p>
			<p class="p-2">{{ page }} ... {{ totalPages == 1 ? "" : totalPages }}</p>
			<p
				v-if="totalPages > 1"
				class="rounded-3xl hover:bg-darkSecondary hover:cursor-pointer dark:hover:bg-black py-2 px-3"
				@click="nextPage"
			>
				Next
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import "~~/types/string.extensions";
const emits = defineEmits<{
	(e: "selected", item: any): void;
	(e: "add");
}>();
const props = defineProps<{
	items: any[];
	itemName?: string;
	list: string[];
}>();

const checkItem = computed(() => {
	if (props.items.length > 0) {
		return true;
	}
	return false;
});
const page = ref(1);
const perPage = ref(11);
watch(
	() => props.items.length,
	() => {
		page.value = 1;
	}
);

const totalPages = computed(() => {
	return Math.ceil(props.items.length / perPage.value);
});

const paginatedItems = computed(() => {
	let start = (page.value - 1) * perPage.value;
	let end = start + (perPage.value - 1);
	return props.items.slice(start, end);
});
const backPage = () => {
	page.value--;
};
const nextPage = () => {
	page.value++;
};
</script>

<style scoped></style>
