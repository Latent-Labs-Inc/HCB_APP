<template>
	<div>
		<h3 class="header">Reply</h3>
		<div class="card dark:bg-darkBg flex flex-col gap-4 p-8 pb-6">
			<h3 class="dark:text-white text-center text-3xl text-primary">
				{{ formattedPhone }}
			</h3>
			<ul class="flex flex-col">
				<li class="received">Hello</li>
				<li class="sent">goodbye</li>
			</ul>
			<div class="flex flex-col gap-3 mt-2">
				<textarea
					v-model="message"
					class="dark:bg-black dark:text-darkSecondary bg-darkSecondary p-4 dark:focus:outline-darkSecondary focus:outline-darkBg outline-1 focus:border-none rounded trans w-full"
					rows="2"
				></textarea>
				<button class="reverse ml-auto px-8" @click="sendMessage">Send</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useMessageStore } from "~~/stores/message";
import { useUiStore } from "~~/stores/ui";

const route = useRoute();
const uiStore = useUiStore();

const phone = ref(route.params.phone as string);

const formattedPhone = computed(() => {
	const digits = phone.value.split("");
	return `+1 (${digits[2]}${digits[3]}${digits[4]}) ${digits[5]}${digits[6]}${digits[7]}-${digits[8]}${digits[9]}${digits[10]}${digits[11]}`;
});

const messageStore = useMessageStore();

const received = ref([] as string[]);

const sent = ref([] as string[]);

const message = ref("");

const sendMessage = async () => {
	uiStore.toggleFunctionLoading(true);
	await messageStore.sendMessage(phone.value, message.value);
	uiStore.toggleFunctionLoading(false);
};
</script>

<style scoped>
li {
	@apply dark:text-white text-primary py-3 px-6 border-solid border-2 rounded-2xl border-primary dark:border-darkSecondary;
}

.sent {
	@apply text-right ml-auto;
}

.received {
	@apply text-left mr-auto;
}
</style>
