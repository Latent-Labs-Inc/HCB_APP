<template>
	<div class="mx-4">
		<div>
			<transition name="fade" mode="out-in">
				<div class="flex flex-col" v-if="!repSelected">
					<UiSearchInline
						v-model="repSearchInput"
						label="Search Rep"
						@search="handleSearch"
					/>
					<SalesRepList
						:items="reps"
						:list="listTitles"
						:itemName="'Sales Rep'"
						@selected="handleSelected"
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
						<button class="w-2/3 mx-auto reverse" @click="saveProfile">
							Save Profile
						</button>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useProfileStore } from "~/stores/profile";
import { useAuthStore } from "~/stores/auth";
import { Profile, SalesRep } from "~/types/types";
import { SalesRepList } from "~~/.nuxt/components";
import { useUiStore } from "~~/stores/ui";

const profileStore = useProfileStore();
const authStore = useAuthStore();
const uiStore = useUiStore();
const router = useRouter();

const input = reactive({
	firstName: {
		val: "",
		isValid: true,
	},
	lastName: {
		val: "",
		isValid: true,
	},
	email: {
		val: "",
		isValid: true,
	},
	phone: {
		val: "",
		isValid: true,
	},
	businessName: {
		val: "",
		isValid: true,
	},
});

const salesRep: SalesRep = reactive({
	user_id: "",
	firstName: "",
	lastName: "",
	email: "",
	phone: "",
	children: [] as string[],
	practices: [] as string[],
	parent_id: "",
	businessName: "",
	created_at: null,
	modified_at: null,
});

const formIsValid = ref(true);

const { formElements, resetValidity } = useFormElements(input);
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

const setInputs = async () => {
	const profile: Profile = !!profileStore.adminSelectedProfile
		? profileStore.adminSelectedProfile
		: profileStore.profile;
	const rep: SalesRep = await profileStore.setSalesRep(profile.rep_id);
	if (!!rep) {
		if (authStore.isAdmin) {
			console.log("runing");
			for (let key in input) {
				input[key].val = rep[key];
			}
		} else {
			for (let key in input) {
				input[key].val = rep[key];
			}
		}
		if (!!rep.parent_id) {
			let parentRep = await profileStore.getParentRep(rep.parent_id);
			repSelected.value = true;
			selectedRep.value = parentRep;
		}
	}
};

onMounted(async () => {
	await setInputs();
});

const validateRep = () => {
	for (let key in input) {
		if (input[key].val.length === 0) {
			input[key].isValid = false;
			formIsValid.value = false;
		} else {
			input[key].isValid = true;
		}
	}
};

const saveProfile = async () => {
	formIsValid.value = true;
	validateRep();

	if (formIsValid.value) {
		uiStore.toggleFunctionLoading(true);
		let children = [];
		let parent_id = null;

		if (!!selectedRep.value) {
			// make sure the parent rep is not the same id as the user_id
			if (selectedRep.value.user_id !== profileStore.adminSelectedProfile.rep_id) {
				parent_id = selectedRep.value.user_id;
			} else {
				parent_id = null;
			}
		}

		salesRep.children.forEach((child: string) => {
			if (child !== salesRep.user_id && !!child && child !== parent_id) {
				children.push(child);
			}
		});

		let user_id = profileStore.adminSelectedProfile.user_id;

		let updatedSalesRep: SalesRep = {
			user_id: user_id,
			firstName: input.firstName.val,
			lastName: input.lastName.val,
			email: input.email.val,
			phone: input.phone.val,
			businessName: input.businessName.val,
			children: children.length > 0 ? children : null,
			practices: salesRep.practices,
			parent_id: !!parent_id ? parent_id : null,
			created_at: !!salesRep.created_at ? salesRep.created_at : new Date(),
			modified_at: new Date(),
		};

		await profileStore.adminAddSalesRep(updatedSalesRep);

		if (!!selectedRep.value) {
			let child_id = updatedSalesRep.user_id;
			let parent_id = selectedRep.value.user_id;
			if (child_id !== parent_id) {
				await profileStore.adminAddChildRep(parent_id, child_id);
			}
		}

		uiStore.toggleFunctionLoading(false);

		router.push("/profile");
	}
};
</script>
