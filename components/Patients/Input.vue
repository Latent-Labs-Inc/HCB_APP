<template>
	<div class="flex flex-col gap-2">
		<div class="form-group">
			<label for="">First Name <span class="text-red-400">*</span></label>
			<input
				class="w-2/3"
				:class="{ 'invalid-input': !input.firstName.isValid }"
				:type="'text'"
				:placeholder="'First Name'"
				v-model.trim="input.firstName.val"
				@blur="resetValidity('firstName')"
			/>
		</div>
		<div class="form-group">
			<label for="">Last Name <span class="text-red-400">*</span></label>
			<input
				class="w-2/3"
				:class="{ 'invalid-input': !input.lastName.isValid }"
				:type="'text'"
				:placeholder="'Last Name'"
				v-model.trim="input.lastName.val"
				@blur="resetValidity('lastName')"
			/>
		</div>
		<div class="row">
			<div class="form-group">
				<label for="">Address 1 <span class="text-red-400">*</span></label>
				<input
					class=""
					:class="{ 'invalid-input': !input.address1.isValid }"
					:type="'text'"
					:placeholder="'Address 1'"
					v-model.trim="input.address1.val"
					@blur="resetValidity('address1')"
				/>
			</div>
			<div class="form-group">
				<label for="">Address 2</label>
				<input
					class="w-2/3"
					:class="{ 'invalid-input': !input.address2.isValid }"
					:type="'text'"
					:placeholder="'ex: Suite 101'"
					v-model.trim="input.address2.val"
					@blur="resetValidity('address2')"
				/>
			</div>
		</div>
		<div class="row">
			<div class="form-group">
				<label for="">City <span class="text-red-400">*</span></label>
				<input
					:class="{ 'invalid-input': !input.city.isValid }"
					:type="'text'"
					:placeholder="'City'"
					v-model.trim="input.city.val"
					@blur="resetValidity('city')"
				/>
			</div>
			<div class="form-group">
				<label for="">State <span class="text-red-400">*</span></label>
				<input
					:class="{ 'invalid-input': !input.state.isValid }"
					:type="'text'"
					:placeholder="'State: ex (GA)'"
					v-model.trim="input.state.val"
					@blur="resetValidity('state')"
				/>
				<p v-if="!input.state.isValid" class="invalid-text">
					Please enter a valid state abbreviation
				</p>
			</div>
			<div class="form-group">
				<label for="">Zip <span class="text-red-400">*</span></label>
				<input
					:class="{ 'invalid-input': !input.postalCode.isValid }"
					:type="'text'"
					:placeholder="'Zip'"
					v-model.trim="input.postalCode.val"
					@blur="resetValidity('postalCode')"
				/>
			</div>
		</div>
		<div class="row">
			<div class="form-group">
				<label>Date of Birth <span class="text-red-400">*</span></label>
				<input
					:class="{ 'invalid-input': !input.dob.isValid }"
					:type="'text'"
					:placeholder="'DOB: ex 01/05/1973'"
					v-model.trim="input.dob.val"
					@blur="resetValidity('dob')"
				/>
				<p v-if="!input.dob.isValid" class="invalid-text">
					Please match this format: 01/01/2000
				</p>
			</div>
			<div class="form-group">
				<label for="">Gender <span class="text-red-400">*</span></label>
				<input
					:class="{ 'invalid-input': !input.gender.isValid }"
					:type="'text'"
					:placeholder="'Gender: M or F'"
					v-model.trim="input.gender.val"
					@blur="resetValidity('gender')"
				/>
				<p v-if="!input.gender.isValid" class="invalid-text">Please enter M or F</p>
			</div>
			<div class="form-group">
				<label for="">Member Id</label>
				<input
					type="text"
					:class="{ 'invalid-input': !input.memberId.isValid }"
					:type="'text'"
					:placeholder="'ex: 0001FQ2'"
					v-model.trim="input.memberId.val"
					@blur="resetValidity('memberId')"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { PatientInput } from "~/types/types";

const props = defineProps<{ input: PatientInput }>();

const resetValidity = (key) => {
	props.input[key].isValid = true;
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
