<template>
	<div>
		<h3 class="header">Home</h3>

		<div class="mx-5 flex flex-col gap-5 p-8">
			<h3 class="header">Send a Message</h3>
			<textarea
				v-model="message"
				class="dark:bg-darkBg dark:text-darkSecondary bg-darkSecondary p-4 dark:focus:outline-darkSecondary focus:outline-darkBg outline-1 focus:border-none rounded trans"
				rows="5"
				cols="30"
			/>
			<button class="reverse" @click="handleMessage">Send Text</button>
		</div>

		<!-- <UiTable
			:cols="cols"
			:gridCols="gridCols"
			:tableData="tableData"
			:properties="properties"
			:dropdownItems="dropdownItems"
			@itemClicked="handleItemClick"
			:pageLength="10"
		/> -->
	</div>
</template>

<script setup lang="ts">
const message = ref("");

const handleMessage = async () => {
	console.log("handleMessage");
	const res = await $fetch("api/twilio", {
		method: "POST",
		body: JSON.stringify({
			message: message.value,
		}),
	});
	console.log(res);
};

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
