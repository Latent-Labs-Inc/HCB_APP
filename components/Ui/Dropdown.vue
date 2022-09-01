<template>
	<div class="dropdown" @mouseleave="toggleActive(false)">
		<div
			class="flex items-center hover:cursor-pointer dark:hover:text-darkPrimary trans"
			@click="toggleActive()"
		>
			Actions
			<i class="justify-center text-xl"><ChevronDown></ChevronDown></i>
		</div>
		<transition name="fade">
			<div class="dropdown-content" v-if="active">
				<div
					class="content"
					v-for="(item, index) in dropdownItems"
					@click="handleItemFunction(item, index)"
				>
					{{ item.label }}
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
import ChevronDown from "~icons/mdi/chevron-down";

interface Item {
	id: string;
	label: string;
}

const props = defineProps<{
	dropdownItems: Item[];
}>();

const emits = defineEmits<{
	(e: "item-clicked", item: Item): void;
}>();

const active = ref(false);

const handleItemFunction = (item: Item, index?: number) => {
	emits("item-clicked", item);
	active.value = false;
};

const toggleActive = (isActive?: boolean) => {
	if (isActive !== undefined) {
		active.value = isActive;
	} else {
		active.value = !active.value;
	}
};
</script>

<style scoped>
.dropdown {
	position: relative;
	display: inline-block;
	@apply trans;
}

.dropdown-content {
	display: none;
	position: absolute;
	min-width: 160px;
	z-index: 1;
	@apply dark:bg-black bg-white rounded-md flex flex-col py-2 shadow-md w-fit;
}
.content {
	@apply dark:hover:bg-darkBg hover:bg-darkSecondary p-3 trans hover:cursor-pointer;
}
</style>
