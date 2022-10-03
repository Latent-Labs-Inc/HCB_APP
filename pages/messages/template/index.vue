<template>
	<div>
		<h3 class="header">Create Template Messages</h3>
		<div class="mx-auto w-2/3 flex flex-col gap-6">
			<div class="form-group">
				<label for="name">Template Name</label>
				<input
					class="mx-auto border shadow-sm border-slate-300 placeholder-slate-400 dark:bg-darkBg dark:focus:outline-darkPrimary"
					:type="'text'"
					:placeholder="'Cash as is Offer'"
					v-model="input.templateName"
				/>
			</div>
			<div class="flex flex-col gap-5">
				<textarea
					v-model="input.message"
					class="dark:bg-darkBg dark:text-darkSecondary bg-darkSecondary p-4 dark:focus:outline-darkSecondary focus:outline-darkBg outline-1 focus:border-none rounded trans"
					rows="5"
					cols="30"
				/>
			</div>
			<div class="flex justify-center">
				<button @click="handleSave">Save Template</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~~/stores/auth";
import { useUiStore } from "~~/stores/ui";
import { Template } from "~~/types/types";

const uiStore = useUiStore();

const authStore = useAuthStore();

const router = useRouter();

const input = reactive({
	templateName: "",
	message: "",
});

const handleSave = async () => {
	uiStore.toggleFunctionLoading(true);
	const { $supabase } = useNuxtApp();
	try {
		const { data, error } = await $supabase.from("templates").insert([
			{
				name: input.templateName,
				message: input.message,
				user_id: authStore.user.id,
				template_id: useUuid(),
				created_at: new Date(),
				modified_at: new Date(),
			},
		] as Template[]);
		if (error) {
			throw error;
		}
		uiStore.toggleFunctionLoading(false);
		router.push("/messages");
	} catch (error) {
		console.log(error);
	}
};
</script>

<style scoped>
.max-width {
	max-width: 600px;
	margin: 0 auto;
}
.card h3 {
	font-size: 3rem;
	padding: 0rem 0 1rem 0;
	text-align: center;
}
.form-group label {
	display: block;
	margin: 0.5rem 0;
	text-align: center;
}
.form-group input {
	width: 100%;
	padding: 0.5rem;
	border: 1px solid #ccc;
	border-radius: 3px;
}
.form-group button {
	width: 100%;
	padding: 0.5rem;
	border: 1px solid #ccc;
	border-radius: 5px;
	margin: 2rem 0 0 0;
}
.form-group p {
	text-align: center;
	margin: 1rem 0;
}
.link {
	text-decoration: underline;
	cursor: pointer;
}
.link:hover {
	color: var(--hover-color);
}
#invalid {
	color: rgb(255, 108, 108);
	text-align: center;
	margin: 1rem 0;
}
.btn:hover {
	background-color: var(--hover-color);
	color: white;
}
</style>
