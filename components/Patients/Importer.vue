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
				<p>Drag and Drop: Patients File</p>
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
					<UiButton class="btn" @click="uploadData">Upload Patients </UiButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { usePatientStore } from "~~/stores/patients";
import { useUiStore } from "~~/stores/ui";

const patientsStore = usePatientStore();
const uiStore = useUiStore();
const selectedFile = ref<any>();
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
			// } else if (
			// 	type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
			// ) {
			// 	selectedFile.value = e.target.files[0];
			// 	fileType.value = "xlsx";
			// 	fileWasImported.value = true;
			// 	fileName.value = e.target.files[0].name;
			// }
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
		// if (
		// 	type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		// ) {
		// 	fileType.value = "xlsx";
		// 	selectedFile.value = file;
		// 	fileWasImported.value = true;
		// 	fileName.value = file.name;

		// } else
		if (type === "text/csv") {
			fileType.value = "csv";
			selectedFile.value = file;
			fileWasImported.value = true;
			fileName.value = file.name;
		} else {
			modalActive.value = true;
			msg.value = "Please make sure you are submitting an .xlsx file";
		}
	} else {
		modalActive.value = true;
		msg.value = "Please make sure you are submitting one file";
	}
};

const uploadData = async () => {
	uiStore.toggleAppLoading(true);
	if (fileType.value === "csv") {
		const reader = new FileReader();
		reader.onload = async (e) => {
			const data = e.target.result;
			// turn data into JSON
			const CSVToJSON = (data, delimiter = ",") => {
				const titles = data.slice(0, data.indexOf("\n")).split(delimiter);

				return data
					.slice(data.indexOf("\n") + 1)
					.split("\n")
					.map((v) => {
						const values = v.split(delimiter);
						return titles.reduce(
							(obj, title, index) => ((obj[title.toLowerCase()] = values[index]), obj),
							{}
						);
					});
			};
			const aoa = CSVToJSON(data);
			const formattedPatients = await useFormatPatients("csv", aoa);
			await patientsStore.uploadPatients(formattedPatients);
			uiStore.toggleAppLoading(false);
		};
		reader.readAsText(selectedFile.value);
	}
	// else if (fileType.value === "xlsx") {
	// 	const data = await selectedFile.value.arrayBuffer();
	// 	const wb = XLSX.read(data);
	// 	const wsName = wb.SheetNames[0];
	// 	if (wb.SheetNames.length > 1) {
	// 		msg.value = "Error there are too many worksheets in the excel file";
	// 		modalActive.value = true;
	// 	}

	// 	const ws = wb.Sheets[wsName];

	// 	const aoa: Patient[] = XLSX.utils.sheet_to_json(ws);

	// 	const formattedPatients = useFormatPatients("xlsx", aoa);

	// 	await patientsStore.uploadPatients(formattedPatients);
	// }
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
