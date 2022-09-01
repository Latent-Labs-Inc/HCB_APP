<template>
	<div class="mx-4">
		<div v-if="authStore.isAdmin">
			<transition name="fade" mode="out-in">
				<div class="flex flex-col" v-if="!repSelected">
					<UiSearchInline
						v-model="repSearchInput"
						label="Sales Rep"
						@search="handleSearch"
					/>
					<SalesRepList
						:items="reps"
						:list="listTitles"
						:itemName="'Sales Rep'"
						@selected="handleSelected"
						@add="addRep"
					/>
					<button
						class="reverse text-center justify-center mx-auto mt-4"
						@click="handleSelected(null)"
					>
						Add Without Rep
					</button>
				</div>
				<div v-else>
					<p class="my-4 flex gap-4 items-center">
						Selected Rep:
						{{
							selectedRep !== null
								? selectedRep.firstName + " " + selectedRep.lastName
								: "None"
						}}
						<span
							class="p-2 rounded-md dark:hover:bg-darkBg cursor-pointer border border-darkBg trans hover:bg-darkSecondary"
							@click="changeRep"
							>Change Rep</span
						>
					</p>
					<div class="mt-6 mb-6 grid grid-cols-3 sm:gap-2 lg:grid-cols-4">
						<FormElementGrid
							class="lg:w-full"
							v-for="formElement in formElements"
							:key="formElement.title"
							:title="formElement.title"
							v-model="input[formElement.id].val"
							:is-valid="input[formElement.id].isValid"
							:error="formElement.error"
							:placeholder="formElement.title"
							:required="formElement.required"
							@reset-validity="resetValidity(formElement.id)"
						/>
					</div>
					<div class="flex justify-center">
						<button class="w-2/3 mx-auto reverse" @click="createProfile">
							Create Profile
						</button>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<script setup lang="ts">
import { PracticeInput, Practice } from "~/types/types";
import { useAuthStore } from "~/stores/auth";
import { useProfileStore } from "~/stores/profile";

const authStore = useAuthStore();
const profileStore = useProfileStore();
const router = useRouter();

const input: PracticeInput = reactive({
	practiceName: {
		val: "",
		isValid: true,
	},
	legalName: {
		val: "",
		isValid: true,
	},
	address1: {
		val: "",
		isValid: true,
	},
	address2: {
		val: "",
		isValid: true,
	},
	city: {
		val: "",
		isValid: true,
	},
	state: {
		val: "",
		isValid: true,
	},
	postalCode: {
		val: "",
		isValid: true,
	},
	contactPhone: {
		val: "",
		isValid: true,
	},
	contactEmail: {
		val: "",
		isValid: true,
	},
	contactName: {
		val: "",
		isValid: true,
	},
	accountsPayableContact: {
		val: "",
		isValid: true,
	},
	accountsPayableEmail: {
		val: "",
		isValid: true,
	},
	accountsPayablePhone: {
		val: "",
		isValid: true,
	},
	clinicalContact: {
		val: "",
		isValid: true,
	},
	clinicalEmail: {
		val: "",
		isValid: true,
	},
	clinicalPhone: {
		val: "",
		isValid: true,
	},
	groupNpi: {
		val: "",
		isValid: true,
	},
	ein: {
		val: "",
		isValid: true,
	},
	ptan: {
		val: "",
		isValid: true,
	},
});
const { formElements, resetValidity } = useFormElements(input);

const { validateInput, formIsValid } = useValidatePracticeInput(input);

const {
	reps,
	repSelected,
	repSearchInput,
	selectedRep,
	listTitles,
	handleSearch,
	changeRep,
	handleSelected,
} = useRepSearch();

onMounted(async () => {
	let practice = await profileStore.practice;
	if (!!practice) {
		for (let key in input) {
			input[key].val = practice[key];
		}
	}
});

const createProfile = async () => {
	validateInput();
	if (formIsValid.value) {
		let practice: Practice = {
			user_id: profileStore.adminSelectedProfile.user_id,
			practiceName: input.practiceName.val,
			legalName: input.legalName.val,
			address: {
				address1: input.address1.val,
				address2: input.address2.val,
				city: input.city.val,
				state: input.state.val,
				postalCode: input.postalCode.val,
			},
			contactPhone: input.contactPhone.val,
			contactEmail: input.contactEmail.val,
			contactName: input.contactName.val,
			accountsPayableContact: input.accountsPayableContact.val,
			accountsPayableEmail: input.accountsPayableEmail.val,
			accountsPayablePhone: input.accountsPayablePhone.val,
			clinicalContact: input.clinicalContact.val,
			clinicalEmail: input.clinicalEmail.val,
			clinicalPhone: input.clinicalPhone.val,
			npi: input.groupNpi.val,
			ein: input.ein.val,
			ptan: input.ptan.val,
			modified_at: null,
			created_at: new Date(),
		};
		await profileStore.adminAddPractice(practice);
	}
};

const addRep = () => {
	router.push("/profile");
};
</script>

<style scoped>
.input {
	border: 1px solid #ccc;
	border-radius: 3px;
	@apply border shadow-sm border-slate-300 placeholder-slate-400 dark:bg-darkBg dark:focus:outline-darkPrimary;
}
</style>
