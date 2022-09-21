<template>
	<div>
		<div
			class="dark:bg-darkBg shadow-lg mx-4 justify-center rounded-lg"
			:class="widths"
		>
			<table class="w-full" v-if="tableData.length > 0">
				<thead
					class="grid p-4 pb-4 bg-darkSecondary dark:bg-darkBg rounded-lg"
					:class="gridCols"
				>
					<tr v-for="col in cols" :key="col">
						{{
							col
						}}
					</tr>
				</thead>
				<tbody class="">
					<tr
						v-for="row in paginatedItems"
						class="grid p-4 dark:odd:bg-black dark:even:bg-darkBg even:bg-darkSecondary"
						:class="gridCols"
						:key="row.id"
					>
						<td v-for="key in properties" :key="key">
							<div v-if="key === 'dropdown'">
								<UiDropdown
									:dropdownItems="dropdownItems"
									@itemClicked="handleItemClick($event, row)"
								/>
							</div>
							<div v-else-if="key.includes('.')">
								<div>
									{{ row[key.split(".")[0]][key.split(".")[1]] }}
								</div>
							</div>
							<div v-else>{{ row[key] }}</div>
						</td>
					</tr>
					<div class="flex justify-end">
						<div
							class="grid grid-cols-3 gap-2 justify-center items-center p-4 dark:even:bg-darkBg even:bg-darkSecondary"
						>
							<i
								class="dark:hover:bg-black hover:bg-darkSecondary py-2 px-0 rounded-md hover:cursor-pointer trans"
								@click="previousPage"
							>
								<ChevronLeft class="mx-auto text-xl"
							/></i>
							<span>{{ page }} of {{ pages }}</span>
							<i
								class="dark:hover:bg-black hover:bg-darkSecondary py-2 px-0 rounded-md hover:cursor-pointer trans"
								@click="nextPage"
								><ChevronRight class="mx-auto text-xl"
							/></i>
						</div>
					</div>
				</tbody>
			</table>
			<div
				v-else
				class="flex justify-center p-4 pb-4 bg-darkSecondary dark:bg-darkBg rounded-lg"
				:class="gridCols"
			>
				None Found
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import ChevronLeft from "~icons/mdi/chevron-left";
import ChevronRight from "~icons/mdi/chevron-right";

interface Item {
	id: string;
	label: string;
}

const props = defineProps<{
	cols: string[];
	widths?: string[];
	gridCols: string;
	tableData: any[];
	properties: string[];
	dropdownItems: Item[];
}>();

const items = ref(props.tableData);

const pageLength = ref(10);

watch(props.tableData, (newVal) => {
	console.log(newVal);
});

const {
	page,
	pages,
	start,
	end,
	paginatedItems,
	nextPage,
	previousPage,
	firstPage,
	lastPage,
} = usePaginate(items, pageLength);

const emits = defineEmits<{
	(e: "item-clicked", item: Item, row: any): void;
}>();

const handleItemClick = (item, row) => {
	emits("item-clicked", item, row);
};
</script>

<style scoped>
* {
	@apply text-primary dark:text-darkSecondary;
}
</style>
