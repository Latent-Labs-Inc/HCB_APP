<template>
	<div>
		<div class="mx-5 flex flex-col gap-5 p-8">
			<textarea
				v-model="message"
				class="dark:bg-darkBg dark:text-darkSecondary bg-darkSecondary p-4 dark:focus:outline-darkSecondary focus:outline-darkBg outline-1 focus:border-none rounded trans"
				rows="5"
				cols="30"
			/>
			<button class="reverse" @click="emitMessage">Send Text</button>
		</div>
	</div>
</template>

<script setup lang="ts">
const message = ref("");
const emit = defineEmits<{
	(e: "send", message: string): void;
}>();

const emitMessage = async () => {
	emit("send", message.value);
};
</script>
