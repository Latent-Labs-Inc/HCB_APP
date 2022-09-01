<template>
	<div>
		<div class="card h-fit trans">
			<div
				class="flex gap-6 border-gray-300 border-solid border-t-0 border-r-0 border-l-0 border-b-2"
			>
				<div
					class="p-2 hover:cursor-pointer mb-2 dark:hover:text-darkPrimary hover:text-secondary"
					:class="{ selected: selectedStatus === status }"
					v-for="status in statuses"
					@click="selectedStatus = status"
				>
					{{ status }}
				</div>
			</div>
			<div class="grid grid-cols-7 py-3 px-4">
				<p>Order Number</p>
				<p>Doctor</p>
				<p>Patient</p>
				<p>Insurance</p>
				<p>Tracking</p>
				<p>Order Date</p>
				<p></p>
			</div>
			<transition name="fade">
				<div v-if="paginatedItems.length > 0">
					<div
						class="grid grid-cols-7 py-3 px-4"
						v-for="(order, index) in paginatedItems"
					>
						<p>{{ order.orderNumber }}</p>
						<p>{{ order.provider }}</p>
						<p>{{ order.patient }}</p>
						<p>{{ order.insurance }}</p>
						<p>{{ order.tracking }}</p>
						<p>{{ order.orderDate }}</p>
						<div
							class="dropdown"
							@mouseleave="toggleActive(order.orderNumber, 'close')"
						>
							<p
								class="flex items-center hover:cursor-pointer dark:hover:text-darkPrimary trans"
								@click="toggleActive(order.orderNumber)"
							>
								Actions
								<i class="justify-center text-xl"><ChevronDown></ChevronDown></i>
							</p>
							<transition name="fade">
								<div class="dropdown-content" v-if="order.active">
									<div class="content" @click="bill(order.orderNumber)">
										Mark as Billed
									</div>
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
				</div>
			</transition>
			<div class="flex justify-end">
				<div class="grid grid-cols-3 gap-2 justify-center items-center">
					<i
						class="dark:hover:bg-black hover:bg-darkSecondary py-2 px-0 rounded-md hover:cursor-pointer trans"
						@click="previousPage"
					>
						<ChevronLeft class="mx-auto text-xl"
					/></i>
					<span>{{ page }} of {{ pages }}</span>
					<i
						class="dark:hover:bg-black hover:bg-darkSecondary py-2 px-0 rounded-md hover:cursor-pointer trans"
						><ChevronRight class="mx-auto text-xl" @click="nextPage"
					/></i>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import ChevronDown from "~icons/mdi/chevron-down";
import ChevronLeft from "~icons/mdi/chevron-left";
import ChevronRight from "~icons/mdi/chevron-right";
import { Order } from "~/types/types";

const selectedStatus = ref("Ready");
const statuses = [
	"Ready",
	"Not Ready",
	"Payment Due",
	"Completed",
	"Held Orders",
];
const orders = ref([
	{
		orderNumber: 1,
		provider: "Dr. John Doe",
		patient: "John Doe",
		insurance: "Aetna",
		tracking: "12345",
		orderDate: "2020-01-01",
		active: false,
		status: "Ready",
	},
]);

const filteredOrders = computed(() => {
	return orders.value.filter((order) => {
		return order.status === selectedStatus.value;
	});
});

const {
	page,
	pages,
	start,
	end,
	paginatedItems,
	nextPage,
	previousPage,
	firstPage,
	lastPage,
} = usePaginate(filteredOrders, 10);

const bill = (orderNumber) => {
	orders.value.forEach((order) => {
		if (order.orderNumber === orderNumber) {
			order.status = "Billed";
		}
	});
};

const toggleActive = (orderNumber: number, trigger?: string) => {
	orders.value.forEach((order) => {
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
