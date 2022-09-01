<template>
	<teleport to="body">
		<transition name="modal-fade">
			<div class="modal-backdrop" v-if="show" @click.self="handleClose">
				<div
					class="mx-auto flex justify-center w-full h-fit"
					role="dialog"
					v-if="show"
					@click.self="handleClose"
				>
					<UiCard class="modal">
						<header
							class="text-center text-2xl mt-4 mb-6 px-4 mx-auto text-primary dark:text-darkSecondary flex justify-center items-center"
						>
							<h2>{{ title }}</h2>
						</header>
						<div class="">
							<slot></slot>
						</div>
					</UiCard>
				</div>
			</div>
		</transition>
	</teleport>
</template>

<script setup lang="ts">
interface Props {
	show: boolean;
	title?: string;
}
const props = defineProps<Props>();
const emit = defineEmits<{
	(e: "close");
}>();
const handleClose = () => emit("close");
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

.modal-fade-enter-from,
.modal-fade-leave-to {
	opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
	transition: opacity 0.5s ease;
}
</style>
