<template>
	<div>
		<h3 class="header">Messages</h3>
		<UiActionButtons :action-props="actionProps" @actionClicked="handleAction" />
		<div>
			<!-- <UiImporter :label="'Twilio Sent Numbers'" :composable="useBadNumbers" /> -->
		</div>
	</div>
</template>

<script setup lang="ts">
// import IconSearch from "~icons/fa-solid/search";
import IconMessage from "~icons/fa-solid/paper-plane";
import IconMail from "~icons/fa-solid/inbox";
import IconTemplate from "~icons/fa-solid/file-alt";

import { ActionProps, Lead } from "~~/types/types";

const router = useRouter();

const actionProps: ActionProps[] = [
	{
		id: "sendMessage",
		name: "Send Message",
		icon: IconMessage,
	},
	{
		id: "viewMessages",
		name: "Received Message",
		icon: IconMail,
	},
	{
		id: "createTemplate",
		name: "Create Template Message",
		icon: IconTemplate,
	},
];

const handleAction = async (action: string) => {
	if (action === "sendMessage") {
		router.push("/messages/send");
	} else if (action === "viewMessages") {
		router.push("/messages/received");
	} else if (action === "createTemplate") {
		router.push("/messages/template");
	}
};
</script>
