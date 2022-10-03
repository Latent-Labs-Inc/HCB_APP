<template>
	<div>
		<h3 class="header">Reply</h3>
		<div class="card dark:bg-darkBg flex flex-col gap-4 p-8 pb-6">
			<h3 class="dark:text-white text-center text-3xl text-primary">
				{{ formattedPhone }}
			</h3>
			<ul class="flex flex-col" v-for="msg in conversation">
				<li class="received" v-if="msg.from === phone">
					{{ msg.message }}
				</li>
				<li class="sent" v-else>{{ msg.message }}</li>
			</ul>
			<div class="flex flex-col gap-3 mt-2">
				<textarea
					v-model="message"
					class="dark:bg-black dark:text-darkSecondary bg-darkSecondary p-4 dark:focus:outline-darkSecondary focus:outline-primary outline-1 focus:border-none rounded trans w-full"
					rows="2"
				></textarea>
				<div class="flex mt-2">
					<button class="reverse mr-auto w-32" @click="viewLead">View Lead</button>
					<button class="w-32" @click="handleFavorites">Favorite</button>
					<button class="reverse ml-auto w-32" @click="sendMessage">Send</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useMessageStore } from "~~/stores/message";
import { useUiStore } from "~~/stores/ui";
import { useLeadStore } from "~~/stores/lead";
import { useAuthStore } from "~~/stores/auth";

import { Message } from "~~/types/types";

const route = useRoute();
const router = useRouter();
const uiStore = useUiStore();
const leadStore = useLeadStore();
const authStore = useAuthStore();

const phone = ref(route.params.phone as string);

const formattedPhone = computed(() => {
	const digits = phone.value.split("");
	return `+1 (${digits[2]}${digits[3]}${digits[4]}) ${digits[5]}${digits[6]}${digits[7]}-${digits[8]}${digits[9]}${digits[10]}${digits[11]}`;
});

const messageStore = useMessageStore();

// const received = ref([] as string[]);

// const sent = ref([] as string[]);

const conversation = ref([] as Message[]);

const message = ref("");

const sendMessage = async () => {
	uiStore.toggleFunctionLoading(true);
	try {
		const res = await $fetch("/api/send-message", {
			method: "POST",
			body: {
				to: phone.value,
				message: message.value,
				user_id: authStore.user_id,
				lead_id: leadStore.lead_id,
			},
		});
		if (res.statusCode === 200) {
			await getConversation();
			message.value = "";
			uiStore.toggleFunctionLoading(false);
		}
	} catch (err) {
		console.log(err);
	}
};

const getConversation = async () => {
	conversation.value = await messageStore.fetchConversation(phone.value);
	// sort the conversation arr by date
	conversation.value.sort((a, b) => {
		return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
	});
};

onBeforeMount(async () => {
	uiStore.toggleFunctionLoading(true);
	await getConversation();
	uiStore.toggleFunctionLoading(false);
});

const viewLead = async () => {
	router.push(`/leads/details/${leadStore.lead_id}`);
};

const handleFavorites = () => {
	leadStore.favorite(leadStore.lead_id, phone.value);
};
</script>

<style scoped>
li {
	@apply dark:text-white text-primary py-3 px-6 border-solid border-2 rounded-2xl border-primary dark:border-darkSecondary sm:max-w-xs md:max-w-md lg:max-w-lg;
}

.sent {
	@apply text-left ml-auto;
}

.received {
	@apply text-left mr-auto;
}
</style>
