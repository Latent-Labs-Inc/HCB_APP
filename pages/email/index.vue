<template>
	<div class="grid gap-4">
		<h3 class="header">Emails</h3>
		<UiActionButtons
			:action-props="actionProps"
			@actionClicked="handleAction"
		/>
	</div>
</template>

<script setup lang="ts">
// @ts-ignore
import IcBaselineEmail from '~icons/ic/baseline-email';
// @ts-ignore
import IcBaselineMarkunreadMailbox from '~icons/ic/baseline-markunread-mailbox';

const router = useRouter();

const actionProps = [
	{
		id: 'startCampaign',
		name: 'Start Email Campaign',
		icon: IcBaselineMarkunreadMailbox,
	},
	{
		id: 'sendSingle',
		name: 'Send Single Email',
		icon: IcBaselineEmail,
	},
];

const handleAction = (action: string) => {
	if (action === 'startCampaign') {
		router.push('/email/campaign');
	} else if (action === 'sendSingle') {
		router.push('/email/single');
	}
};
</script>

<style scoped></style>
