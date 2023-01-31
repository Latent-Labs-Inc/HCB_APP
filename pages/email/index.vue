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
import IconUpload from '~icons/fa-solid/upload';
import IconMail from '~icons/fa-solid/inbox';

const router = useRouter();

const actionProps = [
	{
		id: 'uploadEmails',
		name: 'Upload Emails',
		icon: IconUpload,
	},
	{
		id: 'viewEmails',
		name: 'View Emails',
		icon: IconMail,
	},
];

const handleAction = (action: string) => {
	if (action === 'uploadEmails') {
		router.push('/email/upload');
	} else if (action === 'viewEmails') {
		router.push('/email/view');
	}
};
</script>

<style scoped></style>
