<template>
	<div>
		<div class="grid gap-4" v-if="!templateSelected">
			<transition name="fade" mode="out-in">
				<textarea v-model.trim="message" v-if="!radios[2].selected" />
				<div class="flex my-auto gap-4 justify-center" v-else>
					<label class="my-auto" for="">Search</label>
					<input
						class="py-0 h-8 my-auto"
						type="text"
						v-model.trim="templateInput"
					/>
					<p
						class="my-auto px-4 py-2 dark:bg-darkBg bg-primary rounded-lg cursor-pointer dark:hover:bg-darkPrimary hover:bg-primary trans"
						@click="searchTemplates"
					>
						Search
					</p>
				</div>
			</transition>
		</div>
		<div class="grid gap-2" v-else>
			<p class="mx-auto">Selected Message</p>
			<p class="my-auto">{{ templateSelected.message }}</p>
		</div>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
