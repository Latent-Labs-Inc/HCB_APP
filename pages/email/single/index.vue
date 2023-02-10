<template>
	<div class="grid gap-4">
		<h3 class="header">Send Single Email</h3>
		<div class="grid gap-4 justify-center">
			<div class="flex gap-4 justify-between">
				<label for="">To:</label>
				<input v-model.trim="to" type="text" />
			</div>
			<div class="flex gap-4 justify-between">
				<label class="" for="">Subject:</label>
				<input v-model.trim="subject" type="text" />
			</div>
			<div class="flex flex-col gap-4 justify-between">
				<label class="text-center" for="">Message:</label>
				<textarea v-model.trim="message" class="w-80 sm:w-96"></textarea>
			</div>
			<button @click="handleEmail" class="mx-auto">Send Email</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useUiStore } from '~/stores/ui';

const uiStore = useUiStore();

const to = ref('');
const subject = ref('');
const message = ref('');

const handleEmail = async () => {
	uiStore.toggleFunctionLoading(true);
	try {
		const { data, error } = await $fetch('/api/email/send-single', {
			method: 'POST',
			body: {
				to: to.value,
				message: message.value,
				subject: subject.value,
				attorneyName: 'Attorney Luke',
				address1: '12837 Tim Tam Dr',
				address2: '2',
				city: 'Tampa',
				state: 'Fl',
				zip: '33714',
				prName: 'Bing Bong',
			},
		});
		if (error) throw error;
		if (data) {
			console.log(data);
		}
	} catch (error) {
		console.log(error);
	} finally {
		uiStore.toggleFunctionLoading(false);
		clearInputs();
	}
};

const clearInputs = () => {
	to.value = '';
	subject.value = '';
	message.value = '';
};
</script>

<style scoped></style>
