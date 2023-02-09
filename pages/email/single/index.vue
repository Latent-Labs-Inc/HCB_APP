<template>
	<div class="grid gap-4">
		<h3 class="header">Send Single Email</h3>
		<div class="grid gap-4 justify-center mx-auto">
			<div class="flex gap-4 justify-between">
				<label for="">To:</label>
				<input type="text" />
			</div>
			<div class="flex gap-4 justify-between">
				<label class="" for="">Subject:</label>
				<input type="text" />
			</div>
			<div class="flex flex-col gap-4 justify-between w-full">
				<label class="text-center" for="">Message:</label>
				<textarea class="w-80"></textarea>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
