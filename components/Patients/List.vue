<template>
	<div>
		<div class="flex flex-col my-2 w-11/12 mx-auto">
			<div class="text-primary dark:text-darkSecondary grid grid-cols-4 p-2">
				<div class="">Last Name</div>
				<div class="">First Name</div>
				<div class="">DOB</div>
				<div class="">Member Id</div>
			</div>
			<div
				v-if="paginatedPatients.length > 0"
				v-for="patient in paginatedPatients"
				:key="patient.patient_id"
				class="text-primary dark:text-darkSecondary grid grid-cols-4 rounded hover:bg-darkSecondary dark:hover:bg-black w-full p-2 cursor-pointer trans"
				@click="emits('selected', patient)"
			>
				<div class="">{{ patient.lastName.toTitle() }}</div>
				<div class="">{{ patient.firstName.toTitle() }}</div>
				<div class="">{{ patient.dob }}</div>
				<div class="">{{ patient.insurance.memberId }}</div>
			</div>
			<div
				v-else
				class="text-primary dark:text-darkSecondary flex items-center justify-center rounded w-full p-2 my-12 text-lg"
			>
				<p>No Patients Found</p>
			</div>
		</div>
		<div class="flex justify-center gap-2" v-if="checkPatients">
			<p
				class="rounded-3xl hover:bg-darkSecondary hover:cursor-pointer dark:hover:bg-black p-2 px-3 trans"
				@click="backPage"
			>
				Back
			</p>
			<p class="p-2">{{ page }} ... {{ totalPages == 1 ? "" : totalPages }}</p>
			<p
				v-if="totalPages > 1"
				class="rounded-3xl hover:bg-darkSecondary hover:cursor-pointer dark:hover:bg-black py-2 px-3 trans"
				@click="nextPage"
			>
				Next
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import "~~/types/string.extensions";
import { Patient } from "~/types/types";
const emits = defineEmits<{
	(e: "selected", patient: Patient): void;
}>();
const props = defineProps<{
	patients: Patient[];
}>();

const checkPatients = computed(() => {
	if (props.patients.length > 0) {
		return true;
	}
	return false;
});
const page = ref(1);
const perPage = ref(11);
watch(
	() => props.patients.length,
	() => {
		page.value = 1;
	}
);

const totalPages = computed(() => {
	return Math.ceil(props.patients.length / perPage.value);
});

const paginatedPatients = computed(() => {
	let start = (page.value - 1) * perPage.value;
	let end = start + (perPage.value - 1);
	return props.patients.slice(start, end);
});
const backPage = () => {
	if (page.value > 1) {
		page.value--;
	}
};
const nextPage = () => {
	if (page.value < totalPages.value) {
		page.value++;
	}
};
</script>
