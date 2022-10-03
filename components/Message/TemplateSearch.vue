<template>
	<div class="flex flex-col gap-8">
		<transition name="fade" mode="out-in">
			<UiSearchInline
				label="Templates by Name"
				v-model.trim="input"
				v-if="isTemplate === 'yes' ? true : false"
				@search="handleSearch"
			/>
		</transition>
		<transition name="fade" mode="out-in">
			<div v-if="useTable">
				<UiTable
					v-if="templates.length > 0"
					gridCols="grid-cols-4"
					:cols="templateLabels"
					:properties="templatePropertiesTable"
					:dropdownItems="dropdown"
					:tableData="templates"
					@item-clicked="handleDropdown"
					:key="forceUpdate"
				/>
			</div>
			<div v-else>
				<UiList
					v-if="templates.length > 0"
					:items="templates"
					:itemName="'Templates'"
					:list="templatePropertiesList"
					:flipHover="true"
					@selected="handleSelected"
				/>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
import { Template, Item } from "~/types/types";

const props = defineProps<{
	isTemplate: string;
	useTable: boolean;
}>();

const emits = defineEmits<{
	(e: "selected", template: Template): void;
}>();

const input = ref("");
const templateLabels = ref(["Name", "Message"]);

const templatePropertiesTable = ref(["name", "message", "dropdown"]);

const templatePropertiesList = ref(["name", "message"]);

const dropdown = ref([
	{ label: "Edit", id: "edit" },
	{ label: "Delete", id: "delete" },
] as Item[]);

const templates = ref([] as Template[]);

const forceUpdate = ref(0);

const handleDropdown = (item: Item, row: Template) => {
	if (item.id === "edit") {
		console.log("edit");
	} else if (item.id === "delete") {
		console.log("delete");
	}
};

watch(templates, () => {
	forceUpdate.value++;
});

const handleSearch = async () => {
	try {
		const { $supabase } = useNuxtApp();
		const { data, error } = await $supabase
			.from("templates")
			.select("*")
			.like("name", `%${input.value}%`);
		templates.value = data as Template[];
		console.log(data);
		if (error) throw error;
	} catch (error) {
		console.log(error);
	}
};

const handleSelected = (item: Template) => {
	console.log(item);
	emits("selected", item);
};
</script>
