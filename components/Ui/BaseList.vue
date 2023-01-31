<template>
	<div class="dark:text-white text-primary w-full text-xs">
		<div class="grid my-2">
			<table class="w-full">
				<thead
					class="grid px-2 py-4 sm:p-2 items-center sm:gap-2 text-sm"
					:class="[gridCols]"
				>
					<td v-for="(_, key) in colKeyPairs" :key="key">
						{{ key }}
					</td>
				</thead>
				<transition name="fade" mode="out-in">
					<tbody class="text-sm" v-if="data.length > 0">
						<tr
							v-for="row in paginatedItems"
							class="grid items-center px-2 py-2 sm:gap-2 hover:cursor-pointer rounded-md trans"
							:class="[
								gridCols,
								flip
									? ' hover:dark:bg-darkBg hover:bg-darkSecondary'
									: 'hover:dark:bg-black hover:bg-darkSecondary',
							]"
							@click="handleSelected(row)"
						>
							<td class="py-1" v-for="(value, key) in colKeyPairs" :key="key">
								<div
									class="overflow-x-scroll"
									v-if="colKeyPairs[key].includes('.')"
								>
									{{
										row[colKeyPairs[key].split('.')[0]][
											colKeyPairs[key].split('.')[1]
										]
									}}
								</div>
								<div class="overflow-x-scroll" v-else>
									{{ row[colKeyPairs[key]] }}
								</div>
							</td>
						</tr>
					</tbody>
					<div
						v-else-if="showAdd && data.length === 0"
						class="text-primary dark:text-darkSecondary grid items-center justify-center rounded w-full p-2 my-12 text-lg gap-8"
					>
						<p class="text-center">No {{ itemName }}'s' Found</p>
						<p
							class="btn reverse hover:cursor-pointer text-center"
							@click="useRouter().push(`${addRoute}`)"
						>
							Click to Add a{{ checkVowel(itemName) ? 'n' : '' }} {{ itemName }}
						</p>
					</div>
				</transition>
			</table>
		</div>
		<div class="flex justify-center gap-2" v-if="pages > 1">
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
		</div>
	</div>
</template>

<script setup lang="ts">
// @ts-ignore
import ChevronLeft from '~icons/mdi/chevron-left';
// @ts-ignore
import ChevronRight from '~icons/mdi/chevron-right';

const emits = defineEmits<{
	(e: 'selected', item: any): void;
}>();

const checkVowel = (str: string) => {
	const vowels = ['a', 'e', 'i', 'o', 'u', 'n'];
	return vowels.includes(str[0].toLowerCase());
};

const props = defineProps<{
	colKeyPairs: { [key: string]: string };
	data: any[];
	gridCols: string;
	showAdd?: boolean;
	addRoute?: string;
	itemName: string;
	flip?: boolean;
}>();

watch(
	() => props.data,
	(newVal) => {
		items.value = newVal;
	}
);

const items = ref(props.data);

const pageLength = ref(10);

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

const handleSelected = (item: any) => {
	emits('selected', item);
};
</script>
