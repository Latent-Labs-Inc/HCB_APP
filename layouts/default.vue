<template>
	<div>
		<div class="dark:bg-black">
			<teleport to="body">
				<transition name="modal-fade">
					<div v-if="uiStore.functionLoading" class="modal-backdrop">
						<UiBaseSpinner></UiBaseSpinner>
					</div>
				</transition>
				<transition name="fade" mode="out-in">
					<div class="modal-backdrop z-50" v-if="uiStore.progressBar.show">
						<div
							class="fixed card dark:bg-darkBg w-3/4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 flex flex-col justify-center gap-4"
						>
							<h3 class="text-xl text-white text-center">
								{{ uiStore.progressBar.label }}
							</h3>
							<UiProgressBar
								:max="uiStore.progressBar.max"
								:value="uiStore.progressBar.value"
							/>
						</div>
					</div>
				</transition>
			</teleport>
			<UiNav class="dark:bg-darkBg dark:text-darkSecondary" />
			<div class="flex dark:bg-black h-full w-full">
				<transition name="sidebar" mode="out-in">
					<UiSideNav v-if="uiStore.sidebar" />
				</transition>
				<ClientOnly>
					<transition name="fade" mode="out-in">
						<div
							v-if="!uiStore.appLoading"
							class="max-h-full dark:bg-black trans max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-7xl mx-auto flex-grow"
						>
							<client-only>
								<transition name="route-fade" mode="out-in" appear>
									<div :key="$route.path" class="w-full">
										<slot />
									</div>
								</transition>
							</client-only>
						</div>
						<div v-else class="flex flex-grow mt-40 justify-center trans">
							<UiBaseSpinner />
						</div>
					</transition>
				</ClientOnly>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useUiStore } from '../stores/ui';
import { useAuthStore } from '../stores/auth';
import { Database } from '~/types/supabase';

const supabase = useSupabaseClient<Database>();
const uiStore = useUiStore();
const router = useRouter();

supabase.auth.onAuthStateChange(async (event, session) => {
	if (event === 'SIGNED_OUT') {
		useClearState();
	}
});
if (process.client) {
	window.addEventListener('resize', () => {
		uiStore.setWidth();
		console.log('resize');
	});
}
</script>

<style scoped>
#page-container {
	position: relative;
	min-height: 100vh;
}

#content-wrap {
	padding-bottom: 2.5rem; /* Footer height */
}

#footer {
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 2.5rem; /* Footer height */
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
.route-fade-enter-active,
.route-fade-leave-active {
	transition: opacity 0.15s ease;
}

.route-fade-enter-from,
.route-fade-leave-to {
	opacity: 0;
}
.sidebar-enter-active {
	animation: slide 0.3s;
}
.sidebar-leave-active {
	animation: slide 0.3s reverse;
}

@keyframes slide {
	from {
		opacity: 0;
		transform: translateX(-220px) scale(1);
	}
	to {
		opacity: 100;
		transform: translateX(0) scale(1);
	}
}

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
