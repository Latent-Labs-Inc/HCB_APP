<template>
	<div class="my-6">
		<h3 class="header">Leads</h3>
		<UiActionButtons :action-props="actionProps" @actionClicked="handleAction" />
	</div>
</template>

<script setup lang="ts">
// import IconUser from "~icons/fa-solid/user";
import IconRemove from "~icons/fa-solid/trash";
import IconUpload from "~icons/fa-solid/file-download";
import IconFavorite from "~icons/fa-solid/star";

import { useAuthStore } from "~/stores/auth";
import { ActionProps, Lead } from "~~/types/types";

const router = useRouter();
const searching = ref(false);

const actionProps: ActionProps[] = [
	{
		id: "uploadLeads",
		name: "Upload Leads",
		icon: IconUpload,
	},
	{
		id: "removeLeads",
		name: "Remove Leads",
		icon: IconRemove,
	},
	{
		id: "viewFavorites",
		name: "View Favorites",
		icon: IconFavorite,
	},
];

const handleAction = async (action: string) => {
	if (action === "removeLeads") {
		router.push("/leads/remove");
	} else if (action === "uploadLeads") {
		router.push("/leads/upload");
	} else if (action === "viewFavorites") {
		router.push("/leads/favorites");
	}
};
</script>

<style scoped>
.modal-backdrop {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: rgba(0, 0, 0, 0.3);
	display: flex;
	justify-content: center;
	align-items: center;
}

.modal {
	overflow-x: auto;
}
.form-group {
	@apply flex flex-col gap-2 justify-center  ml-7  text-primary dark:text-darkSecondary lg:w-2/3 lg:mx-auto;
}

.form-group label {
	@apply text-lg font-semibold items-start;
}
.form-group input {
	padding: 0.5rem;
	border: 1px solid #ccc;
	border-radius: 3px;
	@apply border  border-slate-300 placeholder-slate-400 dark:bg-darkBg dark:focus:outline-darkPrimary shadow-sm;
}

p {
	@apply text-primary dark:text-darkSecondary;
}
</style>
