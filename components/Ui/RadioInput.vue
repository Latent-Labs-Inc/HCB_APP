<template>
	<div class="grid">
		<div>
			<p v-if="question">{{ question }}</p>
			<p class="text-sm dark:text-gray-400 text-gray-500" v-if="error">
				*{{ error }}
			</p>
		</div>
		<div class="flex gap-2" :class="row ? 'flex-row' : 'flex-col'">
			<div class="flex" v-for="option of options">
				<div
					class="flex items-center gap-2 cursor-pointer"
					@click="handleOptionClick(option.value)"
				>
					<span
						class="w-[16px] rounded-full text-white h-[16px] cursor-pointer border-solid border-gray-400"
						:class="{
							'bg-primary dark:bg-darkPrimary': selected === option.value,
							'': selected !== option.value,
						}"
					></span>
					<label
						class="text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
						>{{ option.label }}
					</label>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	question?: string;
	options: {
		value: string | boolean;
		label: string;
	}[];
	selected: string | boolean;
	error?: string;
	row?: boolean;
}>();

const emits = defineEmits<{
	(e: 'option-clicked', id: string | boolean): void;
}>();

const handleOptionClick = (id: string | boolean) => {
	emits('option-clicked', id);
};
</script>

<style scoped></style>
