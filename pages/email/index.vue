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
import IconMail from '~icons/fa-solid/inbox';

const router = useRouter();

const actionProps = [
	{
		id: 'startCampaign',
		name: 'Start Email Campaign',
		icon: IcBaselineEmail,
	},
	{
		id: 'viewEmails',
		name: 'View Emails',
		icon: IconMail,
	},
];

const handleAction = (action: string) => {
	if (action === 'startCampaign') {
		router.push('/email/campaign');
	} else if (action === 'viewEmails') {
		router.push('/email/view');
	}
};
</script>

<style scoped></style>
