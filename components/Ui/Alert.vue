<template>
	<transition name="fade" mode="out-in">
		<div
			v-if="show"
			class="fixed flex top-0 bottom-0 right-0 left-0 justify-center items-center z-30 modal-backdrop"
			@click="handleClose"
		>
			<UiCard
				class="mx-auto flex flex-col justify-center w-3/4 sm:w-2/3 h-32 bg-secondary gap-4 lg:w-1/3"
				:class="[
					type === 'error' ? 'text-invalid dark:text-invalid' : 'text-white',
				]"
			>
				<p
					class="text-lg text-center"
					:class="[
						type === 'error' ? 'text-invalid dark:text-invalid' : 'text-white',
					]"
				>
					{{ message }}
				</p>
			</UiCard>
		</div>
	</transition>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
const uiStore = useUiStore();

const props = defineProps<{
	show: boolean;
	message: string;
	type: 'error' | 'success';
}>();

const emits = defineEmits<{
	(e: 'close'): void;
}>();

const handleClose = () => {
	emits('close');
};
</script>

<style scoped>
.y-slide-enter-active {
	animation: y-slide 0.5s;
}
.y-slide-leave-active {
	animation: y-slide 0.5s reverse;
}

@keyframes y-slide {
	0% {
		transform: translateY(-100%);
	}
	100% {
		transform: translateY(0);
	}
}
.modal-backdrop {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
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
