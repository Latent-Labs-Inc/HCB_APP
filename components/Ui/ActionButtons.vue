<template>
	<div class="flex flex-col items-center gap-6">
		<UiCard
			v-for="action in actionProps"
			class="hover:cursor-pointer group hover:bg-primary hover:text-white dark:hover:bg-darkPrimary my-0 trans"
		>
			<div class="" @click="handleAction(action.id)">
				<component
					class="text-4xl mt-2 mb-3 text-center justify-center items-center w-full"
					:is="action.icon"
				/>
				<p class="text-center dark:text-darkSecondary group-hover:text-white">
					{{ action.name }}
				</p>
			</div>
		</UiCard>
	</div>
</template>

<script setup lang="ts">
interface ActionIcon {
	name: string;
	render: () => {};
}
type ActionProps = {
	id: string;
	name: string;
	icon: ActionIcon;
};
const props = defineProps<{
	actionProps: ActionProps[];
}>();
const emits = defineEmits<{
	(e: string, action: string): void;
}>();

const handleAction = async (action: string) => {
	props.actionProps.forEach((actionProp) => {
		if (actionProp.id === action) {
			emits("actionClicked", actionProp.id);
		}
	});
};
</script>
