<template>
	<div class="flex flex-col items-center">
		<UiCard class="">
			<div v-if="authStore.isAdmin">
				<h3>Signup</h3>
				<div class="form-group">
					<label for="username">Username</label>
					<input
						class="w-sm mx-auto border shadow-sm border-slate-300 placeholder-slate-400 dark:bg-darkBg dark:focus:outline-darkPrimary"
						:type="'text'"
						:placeholder="'Username'"
						v-model="input.username"
					/>
				</div>
				<div class="form-group">
					<label for="email">Email</label>
					<input
						class="w-sm mx-auto border shadow-sm border-slate-300 placeholder-slate-400 dark:bg-darkBg dark:focus:outline-darkPrimary"
						:type="'text'"
						:placeholder="'you@email.com'"
						v-model="input.email"
					/>
				</div>
				<div class="form-group">
					<label for="password">Password</label>
					<input
						v-model="input.password"
						type="password"
						placeholder="password"
						class="w-sm mx-auto border shadow-sm border-slate-300 placeholder-slate-400 dark:focus:outline-darkPrimary dark:bg-darkBg"
					/>
				</div>
				<div class="flex flex-col gap-4">
					<UiButton class="mt-7" @click="handleSubmit" mode="reverse">
						Signup
					</UiButton>
					<p class="m-2" id="invalid" v-if="authStore.authError !== ''">
						{{ authStore.authError }}
					</p>
				</div>
			</div>
			<div v-else>
				<h3>Signup</h3>
				<p class="" id="invalid">You must be an admin to signup a user.</p>
			</div>
		</UiCard>
	</div>
</template>

<script setup lang="ts">
import { useUiStore } from "../../stores/ui";
import { useAuthStore } from "../../stores/auth";

const authStore = useAuthStore();
const uiStore = useUiStore();
const router = useRouter();

const input = reactive({
	email: "",
	password: "",
	username: "",
});

const clearInput = () => {
	input.email = "";
	input.password = "";
};

const handleSubmit = async () => {
	uiStore.toggleFunctionLoading(true);
	await authStore.signUp({
		email: input.email,
		password: input.password,
		username: input.username,
		type: "user",
	});
	clearInput();

	if (!authStore.isError && authStore.isLoggedIn) {
		await authStore.signOut();
		await useClearState();
		router.push("/");
		uiStore.toggleSidebar();
	}
	uiStore.toggleFunctionLoading(false);
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
