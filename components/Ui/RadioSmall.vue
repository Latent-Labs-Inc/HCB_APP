<template>
	<div class="flex justify-center gap-4">
		<label
			v-for="radioType in radioTypes"
			:key="radioType.id"
			class="text-base cursor-pointer dark:hover:bg-darkBg hover:bg-darkSecondary rounded-lg p-2 trans"
			:class="{
				selected: radioType.id === modelValue,
				flip: reverse && radioType.id === modelValue,
				flipHover: reverse && radioType.id !== modelValue,
			}"
			@click="handleUpdate(radioType.id)"
			>{{ radioType.label }}
		</label>
	</div>
</template>

<script setup lang="ts">
import { mode } from 'process';

interface RadioType {
	id: string;
	label: string;
}
interface Props {
	radioTypes: RadioType[];
	modelValue: string;
	reverse?: boolean;
}
const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void;
}>();
const props = defineProps<Props>();

const handleUpdate = (type: string) => {
	emit('update:modelValue', type);
};

const isActive = ref(true);
const error = ref(null);

const classObject = computed(() => ({}));
</script>

<style scoped>
.selected {
	@apply dark:bg-darkBg bg-secondary text-white;
}

.flip {
	@apply dark:bg-black;
}
.flipHover {
	@apply dark:hover:bg-black;
}
</style>
