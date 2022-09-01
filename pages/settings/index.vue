<template>
	<div class="my-6">
		<h3 class="header">Settings</h3>
		<div class="">
			<UiCard class="mx-auto flex flex-col gap-4">
				<p class="hover:cursor-pointer hover:underline trans" @click="editProfile">
					Edit Profile
				</p>
				<p class="hover:cursor-pointer hover:underline trans" @click="recovery">
					Reset Password
				</p>
				<p
					class="hover:cursor-pointer hover:underline trans"
					@click="handleCreateUser"
				>
					Create a new User
				</p>
			</UiCard>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useUiStore } from "../../stores/ui";
import { useAuthStore } from "../../stores/auth";

const uiStore = useUiStore();
const authStore = useAuthStore();
const router = useRouter();

const input = reactive({
	email: "",
	password: "",
});

const clearInput = () => {
	for (let key in input) {
		input[key] = "";
	}
};

const recovery = () => {
	router.push("/recovery");
};

const handleCreateUser = () => {
	router.push("/create-user");
};

const editProfile = () => {
	// get the current profile and pass this data to the profile store where the page should render the data based on the store.
	router.push("/profile");
};

const createProfile = async () => {
	uiStore.toggleFunctionLoading(true);
	await authStore.signUp({ email: input.email, password: input.password });
	clearInput();
	if (!authStore.isError) {
		router.push("/");
	}
	uiStore.toggleFunctionLoading(false);
};
</script>
