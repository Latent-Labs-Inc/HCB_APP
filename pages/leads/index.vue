<template>
	<div class="my-6">
		<h3 class="header">Leads</h3>
		<UiActionButtons :action-props="actionProps" @actionClicked="handleAction" />
	</div>
</template>

<script setup lang="ts">
// import IconUser from "~icons/fa-solid/user";
// import IconSearch from "~icons/fa-solid/search";
import IconUpload from "~icons/fa-solid/file-download";

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
];

const authStore = useAuthStore();
const searchInput = ref("");
const filteredLeads = ref([] as Lead[]);

const handleAction = async (action: string) => {
	if (action === "addLead") {
		router.push("/lead/add");
	} else if (action === "searchLead") {
		searching.value = true;
	} else if (action === "uploadLeads") {
		router.push("/leads/upload");
	}
};

const handleSearch = async () => {};

const handleSelected = (lead: Lead) => {
	// leadStore.setSelectedLead(lead);
	// router.push(`/leads/lead-profile/${lead.lead_id}`);
};

const handleClose = () => {
	searching.value = false;
};

const handleUpload = async (data: any[]) => {
	console.log(data);
	const formattedLeads = await useFormattedLeads(data);
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
	@apply flex flex-col gap-2 justify-center  ml-7 lg:w-2/3 lg:mx-auto text-primary dark:text-darkSecondary;
}
.form-group label {
	@apply text-lg font-semibold items-start;
}
.form-group input {
	padding: 0.5rem;
	border: 1px solid #ccc;
	border-radius: 3px;
	@apply border shadow-sm border-slate-300 placeholder-slate-400 dark:bg-darkBg dark:focus:outline-darkPrimary;
}
p {
	@apply text-primary dark:text-darkSecondary;
}
</style>
