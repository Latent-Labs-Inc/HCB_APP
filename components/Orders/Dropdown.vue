<template>
	<div>
		<div class="dropdown" @mouseleave="toggleActive(order.number, 'close')">
			<p
				class="flex items-center hover:cursor-pointer dark:hover:text-darkPrimary trans"
				@click="toggleActive(order.number)"
			>
				Actions
				<i class="justify-center text-xl"><ChevronDown></ChevronDown></i>
			</p>
			<transition name="fade">
				<div class="dropdown-content" v-if="order.active">
					<div class="content" @click="bill(order.number)">Mark as Billed</div>
					<div class="content" @click="form1500">Download Form 1500</div>
					<div class="content" @click="printPackingSlip">Print Packing Slip</div>
					<div class="content" @click="printSalesSlip">Print Sales Slip</div>
					<div class="content" @click="pod">POD</div>
					<div class="content" @click="orderNotes">Order Notes</div>
					<div class="content" @click="eob">EOB</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Order } from "~/types/types";
const props = defineProps<{
	orders: Order[];
}>();
const bill = (orderNumber) => {
	props.orders.forEach((order) => {
		if (order.orderNumber === orderNumber) {
			order.status = "Completed";
		}
	});
};

const toggleActive = (orderNumber: number, trigger?: string) => {
	props.orders.forEach((order) => {
		if (order.orderNumber === orderNumber) {
			if (trigger === "close") {
				order.active = false;
			} else {
				order.active = !order.active;
			}
		}
	});
};

const form1500 = () => {
	console.log("Download Form 1500");
};
const printPackingSlip = () => {
	console.log("Print Packing Slip");
};
const printSalesSlip = () => {
	console.log("Print Sales Slip");
};
const pod = () => {
	console.log("POD");
};
const orderNotes = () => {
	console.log("Order Notes");
};
const eob = () => {
	console.log("EOB");
};
</script>

<style scoped>
.dropdown {
	position: relative;
	display: inline-block;
	@apply trans;
}

.dropdown-content {
	display: none;
	position: absolute;
	min-width: 160px;
	z-index: 1;
	@apply dark:bg-black bg-white rounded-md flex flex-col py-2 shadow-md w-fit;
}
.content {
	@apply dark:hover:bg-darkBg hover:bg-darkSecondary p-3 trans hover:cursor-pointer;
}

.card {
	@apply items-center justify-center trans text-primary dark:text-darkSecondary dark:bg-darkBg bg-white m-6;
}

.selected {
	border-bottom: 3px solid;
	@apply dark:text-darkPrimary rounded-sm;
}
</style>
