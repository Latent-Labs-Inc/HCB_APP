<template>
	<div>
		<h3 class="header">Messages</h3>
		<UiActionButtons
			:action-props="actionProps"
			@actionClicked="handleAction"
		/>
		<div>
			<!-- <UiImporter :label="'Twilio Sent Numbers'" :composable="useBadNumbers" /> -->
		</div>
	</div>
</template>

<script setup lang="ts">
// @ts-ignore
import IconMessage from '~icons/fa-solid/paper-plane';
// @ts-ignore
import IconMail from '~icons/fa-solid/inbox';
// @ts-ignore
import IconTemplate from '~icons/fa-solid/file-alt';
// @ts-ignore
import IcRoundTextsms from '~icons/ic/round-textsms';

import { ActionProps, Lead } from '~~/types/types';

const router = useRouter();

const actionProps: ActionProps[] = [
	{
		id: 'bulkMessage',
		name: 'Send Bulk Message',
		icon: IconMessage,
	},
	{
		id: 'sendMessage',
		name: 'Send Message',
		icon: IcRoundTextsms,
	},
	{
		id: 'viewMessages',
		name: 'Received Message',
		icon: IconMail,
	},
	{
		id: 'createTemplate',
		name: 'Create Template Message',
		icon: IconTemplate,
	},
];

const handleAction = async (action: string) => {
	if (action === 'bulkMessage') {
		router.push('/messages/send-bulk');
	} else if (action === 'viewMessages') {
		router.push('/messages/received');
	} else if (action === 'createTemplate') {
		router.push('/messages/template');
	} else if (action === 'sendMessage') {
		router.push('/messages/send-single');
	}
};
</script>
