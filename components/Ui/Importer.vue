<template>
	<div>
		<UiBaseModal
			:show="modalActive"
			title="Invalid File Type"
			:actions="true"
			@confirm="clearFile"
			@cancel="clearFile"
		>
			<p class="msg">{{ msg }}</p>
		</UiBaseModal>
		<div class="flex justify-center items-center">
			<div
				class="import-box"
				v-if="!fileWasImported"
				@dragenter.prevent="toggleDrag"
				@dragleave.prevent="toggleDrag"
				@dragover.prevent
				@drop.prevent="dropFile"
				:class="{ 'active-dropzone': dragActive }"
			>
				<p>Drag and Drop: {{ label }} File</p>
				<p>Or</p>
				<div class="flex">
					<label for="file" class="btn cursor-pointer">Choose File</label>
					<input type="file" id="file" @change="handleFile" class="hidden" />
				</div>
			</div>
			<div class="flex flex-col gap-5 justify-center items-center" v-else>
				<p class="mt-4">File: {{ fileName }}</p>
				<div class="flex justify-center">
					<label for="change-file" class="cursor-pointer reverse"
						>Select New File</label
					>
					<input type="file" @change="handleFile" id="change-file" class="hidden" />
				</div>
				<div>
					<UiButton class="btn" @click="uploadData">Upload {{ label }} </UiButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useUiStore } from "~~/stores/ui";

const props = defineProps<{
	label: string;
	composable: (aoa) => void;
}>();

const uiStore = useUiStore();
const selectedFile = ref<any>(null);
const fileType = ref<"xlsx" | "csv">(null);
const fileWasImported = ref(false);
const fileName = ref("");
const modalActive = ref(false);
const msg = ref("");
const dragActive = ref(false);

const handleFile = (e) => {
	console.log("running handle file");
	if (e.target.files.length === 1) {
		const type = e.target.files[0].type;
		if (type === "text/csv") {
			fileType.value = "csv";
			selectedFile.value = e.target.files[0];
			fileWasImported.value = true;
			fileName.value = e.target.files[0].name;
		} else {
			modalActive.value = true;
			msg.value = "Please make sure you are submitting an .csv file";
		}
	} else {
		modalActive.value = true;
		msg.value = "Please make sure you are submitting one file";
	}
};

const clearFile = () => {
	selectedFile.value = null;
	fileWasImported.value = false;
	fileName.value = null;
	modalActive.value = false;
	msg.value = null;
};

const toggleDrag = () => {
	dragActive.value = !dragActive.value;
};

const dropFile = (e) => {
	toggleDrag();
	const file = e.dataTransfer.files[0];
	if (e.dataTransfer.files.length === 1) {
		const type = file.type;
		if (type === "text/csv") {
			fileType.value = "csv";
			selectedFile.value = file;
			fileWasImported.value = true;
			fileName.value = file.name;
		} else {
			modalActive.value = true;
			msg.value = "Please make sure you are submitting an .csv file";
		}
	} else {
		modalActive.value = true;
		msg.value = "Please make sure you are submitting one file";
	}
};

const uploadData = async () => {
	uiStore.toggleAppLoading(true);
	console.log("running upload data");
	if (fileType.value === "csv") {
		const reader = new FileReader();
		reader.readAsText(selectedFile.value);

		reader.onload = async (e) => {
			const data = e.target.result;

			var array = data.toString().split("\r");

			let result = [];

			let headers = array[0].split(",");

			console.log(headers);

			for (let i = 1; i < array.length - 1; i++) {
				let obj = {};

				let str = array[i];
				let s = "";

				let flag = 0;
				for (let ch of str) {
					if (ch === '"' && flag === 0) {
						flag = 1;
					} else if (ch === '"' && flag == 1) flag = 0;
					if (ch === ", " && flag === 0) ch = "|";
					if (ch !== '"') s += ch;
				}

				// Split the string using pipe delimiter |
				// and store the values in a properties array
				let properties = s.split("|");
				let values = properties[0].split(",");

				headers.forEach((header, index) => {
					if (!!header) {
						obj[header] = values[index]?.includes("\n")
							? values[index].replace("\n", "")
							: values[index];
					}
				});
				// For each header, if the value contains
				// multiple comma separated data, then we
				// store it in the form of array otherwise
				// directly the value is stored

				// Add the generated object to our
				// result array
				result.push(obj);
			}

			await props.composable(result);
		};

		uiStore.toggleAppLoading(false);
	}
	clearFile();
};
</script>

<style scoped>
.import-box {
	@apply flex flex-col border-dashed border border-primary dark:border-darkPrimary justify-center items-center self-center h-40 text-center m-4 w-4/6;
	border: dashed 2.5px var();
}

p {
	@apply justify-center text-primary dark:text-darkSecondary mb-2;
}
.active-dropzone {
	@apply bg-darkSecondary dark:bg-darkPrimary trans text-white dark:text-darkSecondary;
}
</style>
