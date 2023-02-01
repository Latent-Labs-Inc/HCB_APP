<template>
	<div class="grid gap-4">
		<h3 class="header">Send Text</h3>
		<div class="grid gap-4 dark:text-white">
			<div class="flex gap-4 my-auto mx-auto">
				<label for="">Phone Number:</label>
				<input
					class="px-2 py-1 outline-none border-none focus:outline-none focus:border-none bg-darkSecondary dark:bg-darkBg dark:text-white"
					type="text"
					v-model.trim="phone"
				/>
			</div>
			<div class="flex gap-4 my-auto mx-auto items-center">
				<label for="">Message:</label>
				<textarea
					class="dark:bg-darkBg bg-darkSecondary rounded-md outline-none py-2 px-4 dark:text-white"
					:cols="50"
					:rows="5"
					v-model.trim="message"
				/>
			</div>
			<div class="flex mx-auto">
				<button class="w-40" @click="handleSend">Send Message</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useUiStore } from '~/stores/ui';

const uiStore = useUiStore();

const phone = ref('');
const message = ref('');

const validate = () => {
	// get the digits of the phone number using regex
	const digits = phone.value.match(/\d/g);
	// join the digits together
	const number = digits!.join('');
	// check if the number is 10 digits long
	if (number.length === 10) {
		return true;
	}
	if (message.value.length > 0) {
		return true;
	}
	return false;
};

const handleSend = async () => {
	if (validate()) {
		uiStore.toggleFunctionLoading(true);
		try {
			const { data, error } = await $fetch('/api/send-message-single', {
				method: 'POST',
				body: {
					phone: `+1${phone.value.match(/\d/g)!.join('')}`,
					message: message.value,
				},
			});

			if (error) {
				throw new Error(error);
			}

			console.log(data);
		} catch (error) {
			console.log(error);
		} finally {
			uiStore.toggleFunctionLoading(false);
		}
	}
};
</script>

<style scoped></style>
