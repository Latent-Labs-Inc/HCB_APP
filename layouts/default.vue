<template>
	<div></div>
	<!--  -->
</template>

<script setup lang="ts">
import { useUiStore } from "../stores/ui";
import { useAuthStore } from "../stores/auth";

const { $supabase } = useNuxtApp();
const uiStore = useUiStore();

$supabase.auth.onAuthStateChange(async (event, session) => {
	if (event === "SIGNED_OUT") {
		useClearState();
	}
});

String.prototype.toTitle = function () {
	return this.replace(/(^|\s)\S/g, function (t) {
		return t.toUpperCase();
	});
};
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
