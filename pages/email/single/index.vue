<template>
	<div class="grid gap-4">
		<h3 class="header">Send Single Email</h3>
		<div class="grid gap-4 justify-center">
			<div class="flex gap-4 justify-between">
				<label for="">To:</label>
				<input type="text" />
			</div>
			<div class="flex gap-4 justify-between">
				<label class="" for="">Subject:</label>
				<input type="text" />
			</div>
			<div class="flex flex-col gap-4 justify-between">
				<label class="text-center" for="">Message:</label>
				<textarea class="w-80 sm:w-96"></textarea>
			</div>
			<button class="mx-auto">Send Email</button>
		</div>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
