<template>
	<div>
		<h3 class="header">Home</h3>
		<UiTable
			:cols="cols"
			:gridCols="gridCols"
			:tableData="tableData"
			:properties="properties"
			:dropdownItems="dropdownItems"
			@itemClicked="handleItemClick"
			:pageLength="10"
		/>
	</div>
</template>

<script setup lang="ts">
import { EligibilityResponse } from "~~/types/change";
const eligibility = ref({});
const benefitsInformation = ref([]);

await useLoadContent();

const cols = ref(["Name", "Email", "Phone", "Order", "Patient"]);

const gridCols = ref("grid-cols-6");

const tableData = ref([
	{
		name: "John Doe",
		email: "jimm@jimmm",
		phone: "",
		order: "",
		patient: "",
	},
	{
		name: "John Doe",
		email: "jimm@jimmm",
		phone: "",
		order: "",
		patient: "",
	},
	{
		name: "John Doe",
		email: "jimm@jimmm",
		phone: "",
		order: "",
		patient: "",
	},
	{
		name: "John Doe",
		email: "jimm@jimmm",
		phone: "",
		order: "",
		patient: "",
	},
	{
		name: "John Doe",
		email: "jimm@jimmm",
		phone: "",
		order: "",
		patient: "",
	},
	{
		name: "John Doe",
		email: "jimm@jimmm",
		phone: "",
		order: "",
		patient: "",
	},
	{
		name: "John Doe",
		email: "jimm@jimmm",
		phone: "",
		order: "",
		patient: "",
	},
	{
		name: "John Doe",
		email: "jimm@jimmm",
		phone: "",
		order: "",
		patient: "",
	},
]);
const properties = ref([
	"name",
	"email",
	"phone",
	"order",
	"patient",
	"dropdown",
]);
const dropdownItems = ref([
	{
		id: "1",
		label: "Edit",
	},
	{
		id: "2",
		label: "Delete",
	},
]);

const handleItemClick = (item, row) => {
	console.log(item, row);
};
// const searchChangeHealth = async () => {
// 	// looking for medical service type codes 12 or DM
// 	const res: EligibilityResponse = await $fetch("/api/changeEligibility", {
// 		method: "POST",
// 		body: {
// 			medicalServiceTypeCodes: ["12", "DM"],
// 		},
// 	});

// 	eligibility.value = res;
// 	benefitsInformation.value = res.benefitsInformation;

// 	console.log(res);
// };
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
