<template>
	<div>
		<UiAlert
			class="mx-auto w-3/4"
			:show="modalActive"
			:message="'Invalid File Type'"
			@close="clearFile"
			:type="'error'"
		/>
		<div class="flex justify-center items-center">
			<div
				class="import-box w-full"
				v-if="!fileWasImported"
				@dragenter.prevent="toggleDrag"
				@dragleave.prevent="toggleDrag"
				@dragover.prevent
				@drop.prevent="dropFile"
				:class="{ 'active-dropzone': dragActive }"
			>
				<p>Drag and Drop{{ label ? `: ${label}` : '' }}</p>
				<p>Or</p>
				<div class="flex">
					<label
						:for="id"
						class="text-base px-4 py-1 dark:bg-darkPrimary text-white bg-primary hover:bg-secondary rounded-full hover:dark:bg-black cursor-pointer trans"
						>Choose File</label
					>
					<input type="file" :id="id" @change="handleFile" class="hidden" />
				</div>
			</div>
			<div class="flex flex-col gap-5 justify-center items-center" v-else>
				<p class="mt-4">File: {{ fileName }}</p>
				<div class="flex justify-center">
					<label
						for="change-file"
						class="text-base px-4 py-1 dark:bg-black text-white bg-primary hover:bg-secondary rounded-full hover:dark:bg-darkPrimary cursor-pointer trans"
						>New File</label
					>
					<input
						type="file"
						@change="handleFile"
						id="change-file"
						class="hidden"
					/>
				</div>
				<div>
					<p
						class="text-base px-4 py-1 dark:bg-darkPrimary text-white bg-primary hover:bg-secondary rounded-full hover:dark:bg-darkBg cursor-pointer trans"
						@click="uploadData"
					>
						Upload File
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~~/stores/auth';
import { useUiStore } from '~~/stores/ui';

const authStore = useAuthStore();

const uiStore = useUiStore();
const selectedFile = ref<null | File>();
const fileWasImported = ref(false);
const fileName = ref('');
const msg = ref('');
const selectedFileType = ref('');
const modalActive = ref(false);

const dragActive = ref(false);

const props = defineProps<{
	fileTypes: string[];
	fileError: string;
	label?: string;
	id: string;
}>();

const emits = defineEmits<{
	(e: 'file-added', file: File): void;
}>();

const checkFileType = (e: any) => {
	if (e.target.files.length === 1) {
		const type = e.target.files[0].type;
		console.log(type);
		const fileTypes = props.fileTypes;
		if (fileTypes.includes(type)) {
			selectedFileType.value = type;
			selectedFile.value = e.target.files[0];
			fileWasImported.value = true;
			fileName.value = e.target.files[0].name;
		} else {
			modalActive.value = true;
			msg.value = props.fileError;
		}
	} else {
		modalActive.value = true;
		msg.value = 'Please make sure you are submitting one file';
	}
};
const handleFile = (e: any) => {
	checkFileType(e);
};

const clearFile = () => {
	selectedFile.value = null;
	fileWasImported.value = false;
	fileName.value = '';
	modalActive.value = false;
	msg.value = '';
};

const toggleDrag = () => {
	dragActive.value = !dragActive.value;
};

const dropFile = (e: any) => {
	toggleDrag();
	const file = e.dataTransfer.files[0];
	checkFileType(file);
};

const uploadData = async () => {
	uiStore.toggleFunctionLoading(true);
	if (selectedFile.value) {
		emits('file-added', selectedFile.value);
	}
	clearFile();
	uiStore.toggleFunctionLoading(false);
};
</script>

<style scoped>
.import-box {
	@apply flex flex-col border-dashed border border-primary dark:border-darkPrimary justify-center items-center self-center h-fit text-center p-4;
	border: dashed 2.5px var();
}

p {
	@apply justify-center text-primary dark:text-darkSecondary mb-2;
}
.active-dropzone {
	@apply bg-darkSecondary dark:bg-darkPrimary trans text-white dark:text-darkSecondary;
}
</style>
