<template>
	<div class="flex flex-col items-center">
		<UiCard>
			<div v-if="!authStore.user">
				<h3>Login</h3>
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
						:type="hide ? 'password' : 'text'"
						placeholder="password"
						class="w-sm mx-auto border shadow-sm border-slate-300 placeholder-slate-400 dark:focus:outline-darkPrimary dark:bg-darkBg"
					/>
				</div>
				<div class="mt-4 mb-0 pb-0">
					<p class="text-sm text-center cursor-pointer trans" @click="handleHide">
						{{ hide ? "Show" : "Hide" }}
					</p>
				</div>
				<div class="flex flex-col gap-4">
					<UiButton class="mt-7" @click="handleSubmit" mode="reverse">
						Login
					</UiButton>
					<p class="m-2" id="invalid" v-if="authStore.authError !== ''">
						{{ authStore.authError }}
					</p>
					<div class="flex flex-col justify-center" v-if="reset">
						<p class="text-center m-2" v-if="!emailSent">
							Are you sure you would like to reset your password?
						</p>
						<p class="text-center m-2" v-else>
							An email has been sent to you with instructions on how to reset your
							password, please check your inbox.
						</p>
						<div class="flex">
							<button class="reverse mx-auto my-3" @click="cancelReset">Cancel</button>
							<p
								class="reverse hover:cursor-pointer mx-auto my-3"
								@click="handleReset"
							>
								Reset
							</p>
						</div>
					</div>
					<div v-else>
						<p class="flex justify-center mb-3">
							Forgot Your Password?
							<span class="link px-2" @click="handleReset">Reset Password</span>
						</p>
					</div>
				</div>
			</div>
		</UiCard>
	</div>
</template>

<script setup lang="ts">
import { useUiStore } from "../../stores/ui";
import { useAuthStore } from "../../stores/auth";
const authStore = useAuthStore();

const router = useRouter();

const input = reactive({
	email: "",
	password: "",
});

const handleHide = () => {
	hide.value = !hide.value;
};

const clearInput = () => {
	input.email = "";
	input.password = "";
};
const emailSent = ref(false);
const uiStore = useUiStore();

const handleSubmit = async () => {
	uiStore.toggleFunctionLoading(true);
	await authStore.signIn({ email: input.email, password: input.password });
	clearInput();
	if (!authStore.isError && authStore.isLoggedIn) {
		router.push("/");
		uiStore.toggleSidebar();
	}
	uiStore.toggleFunctionLoading(false);
};

const reset = ref(false);
const handleReset = async () => {
	if (!reset.value) {
		reset.value = true;
	} else {
		emailSent.value = true;
		uiStore.toggleFunctionLoading(true);
		await authStore.resetPassword(input.email);
		uiStore.toggleFunctionLoading(false);
	}
};
const cancelReset = () => {
	reset.value = false;
};

const hide = ref(true);

onMounted(async () => {
	if (authStore.isLoggedIn) {
		router.push("/");
	}
});
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
