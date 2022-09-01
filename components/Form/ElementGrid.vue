<template>
	<div class="form-group">
		<label for=""
			>{{ title }} <span v-if="required" class="invalid-text">*</span></label
		>
		<input
			:class="{ 'invalid-input': !isValid }"
			:type="'text'"
			:value="modelValue"
			:placeholder="placeholder ? placeholder : title"
			@input="handleInput"
			@blur="resetValidity()"
		/>
		<p v-if="!isValid" class="invalid-text">{{ error }}</p>
	</div>
</template>

<script setup lang="ts">
interface Element {
	title: string;
	modelValue: string;
	isValid: boolean;
	required: boolean;
	error?: string;
	placeholder?: string;
}
const props = defineProps<Element>();
const emits = defineEmits<{
	(e: "update:modelValue", modelValue: string);
	(e: "resetValidity");
}>();
const resetValidity = () => {
	emits("resetValidity");
};
const handleInput = (e: any) => {
	emits("update:modelValue", e.target.value);
};
</script>

<style scoped>
.invalid-input {
	color: rgb(255, 108, 108);
	border: none;
	outline: 2px solid rgb(255, 108, 108);
	border-radius: 5px;
}
.invalid-text {
	color: rgb(255, 108, 108);
}
.form-group {
	@apply flex flex-col gap-2 justify-center text-primary dark:text-darkSecondary;
}
.form-group label {
	@apply text-lg font-semibold items-start;
}
.form-group input {
	padding: 0.5rem;
	border: 1px solid #ccc;
	border-radius: 3px;
	@apply border shadow-sm border-slate-300 placeholder-slate-400 dark:bg-darkBg dark:focus:outline-darkPrimary;
}
p {
	@apply text-center mb-2 text-lg;
}
</style>
