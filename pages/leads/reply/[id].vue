<template>
	<div>
		<h3 class="header">Reply</h3>
		<div class="card">
			<ul class="flex">
				<li class="">Hello</li>
				<li>goodbye</li>
			</ul>
			<div>
				<textarea
					v-model="message"
					class="dark:bg-darkBg dark:text-darkSecondary bg-darkSecondary p-4 dark:focus:outline-darkSecondary focus:outline-darkBg outline-1 focus:border-none rounded trans"
					rows="3"
					cols="15"
				></textarea>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useMessageStore } from "~~/stores/message";

const route = useRoute();

const lead_id = ref(route.params.id as string);

const messageStore = useMessageStore();

const received = ref([] as string[]);

const sent = ref([] as string[]);

const message = ref("");
</script>
