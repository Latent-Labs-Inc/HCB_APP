<template>
	<div>
		<h2 class="header">Add Patient</h2>
		<PatientsInput :input="input" />
		<div class="flex my-8">
			<button class="mx-auto w-3/4 reverse" @click="insLookup">
				Find Insurance
			</button>
		</div>
		<InsuranceList :input="input" />
		<div class="flex justify-end my-4">
			<button class="w-1/4 mr-4" @click="addPatient">Save Patient</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Patient } from "~~/types/types";
import { usePatientStore } from "~~/stores/patients";
import { useUiStore } from "~~/stores/ui";
import { useAuthStore } from "~~/stores/auth";
import { EligibilityResponse, Subscriber } from "~~/types/change";

const patientStore = usePatientStore();
const uiStore = useUiStore();
const authStore = useAuthStore();
const checkedIns = ref(false);
const router = useRouter();

const { validateInput, input, formIsValid } = useValidatePatientInput();

const clearInputs = () => {
	for (let key in input) {
		if (key === "insurance") {
			input.insurance.benefitsInformation = [];
			input.insurance.planStatus = [];
			input.insurance.memberId = "";
		} else {
			input[key].val = "";
		}
	}
};

const insLookup = async () => {
	validateInput();
	if (formIsValid.value) {
		let subscriber: Subscriber = {
			memberId: input.memberId.val,
			firstName: input.firstName.val,
			lastName: input.lastName.val,
			gender: input.gender.val,
			dateOfBirth: input.dob.val,
		};
		uiStore.toggleFunctionLoading(true);
		const res: EligibilityResponse = await $fetch("/api/changeEligibility", {
			method: "POST",
			body: subscriber,
		});
		input.insurance.benefitsInformation = res.benefitsInformation;
		input.insurance.planStatus = res.planStatus;
		checkedIns.value = true;
		uiStore.toggleFunctionLoading(false);
	}
};

const addPatient = async () => {
	validateInput();
	if (formIsValid.value) {
		uiStore.toggleFunctionLoading(true);
		input.insurance.memberId = input.memberId.val;
		let patient: Patient = reactive({
			firstName: input.firstName.val,
			lastName: input.lastName.val,
			address: {
				address1: input.address1.val,
				address2: input.address2.val,
				city: input.city.val,
				state: input.state.val,
				postalCode: input.postalCode.val,
			},
			dob: input.dob.val,
			gender: input.gender.val,
			insurance: input.insurance,
			user_id: authStore.user_id,
			patient_id: useUuid(),
			created_at: new Date(),
			modified_at: new Date(),
		});

		await patientStore.addPatient(patient);

		clearInputs();
		router.push("/patients");

		uiStore.toggleFunctionLoading(false);
	}
};
</script>

<style scoped>
.invalid-input {
	color: rgb(255, 108, 108);
	border: none;
	outline: 2px solid rgb(255, 108, 108);
	border-radius: 5px;
}
.invalid-text {
	color: rgb(255, 108, 108);
}
.form-group {
	@apply flex flex-col gap-1 justify-center  ml-7 lg:w-2/3 lg:mx-auto text-primary dark:text-darkSecondary;
}
.row {
	@apply flex lg:w-2/3 lg:mx-auto lg:gap-4;
}
.form-group label {
	@apply font-semibold items-start;
}
.form-group input {
	padding: 0.4rem;
	border: 1px solid #ccc;
	border-radius: 3px;
	@apply border shadow-sm border-slate-300 placeholder-slate-400 dark:bg-darkBg dark:focus:outline-darkPrimary;
}
p {
	@apply text-center mb-2 text-sm;
}
</style>
