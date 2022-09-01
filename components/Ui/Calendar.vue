<template>
	<div class="w-fit rounded-md">
		<div class="card">
			<div class="flex mb-3 justify-center gap-1 items-center trans">
				<i class="chevron" @click="decrement('month')"
					><ChevronLeft class="mx-auto text-lg"
				/></i>
				<div>
					<p class="text-center trans w-20">{{ months[selectedMonth] }}</p>
				</div>
				<i class="chevron" @click="increment('month')"
					><ChevronRight class="mx-auto text-lg"
				/></i>
				<i class="chevron" @click="selectedYear -= 1"
					><ChevronLeft class="mx-auto text-lg"
				/></i>
				<p class="trans">{{ selectedYear }}</p>
				<i class="chevron" @click="selectedYear += 1"
					><ChevronRight class="mx-auto text-lg"
				/></i>
			</div>
			<div class="grid grid-cols-7">
				<div v-for="dayName in dayNames" class="px-2 mx-auto">
					<p class="">{{ dayName.slice(0, 2) }}</p>
				</div>
				<div v-for="(day, index) in days">
					<div
						v-if="day !== ''"
						class="border dark:hover:bg-black flex p-2 text-center items-center justify-center rounded-md hover:cursor-pointer hover:bg-darkSecondary"
						@click="selectDay(day)"
					>
						<p class="">{{ day }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import ChevronLeft from "~icons/mdi/chevron-left";
import ChevronRight from "~icons/mdi/chevron-right";

const emits = defineEmits<{
	(e: "daySelected", date: Date): void;
}>();

const selectedMonth = ref(new Date().getMonth());
const selectedYear = ref(new Date().getFullYear());
const daysInMonth = [
	31,
	selectedYear.value % 4 === 0 ? 29 : 28,
	31,
	30,
	31,
	30,
	31,
	31,
	30,
	31,
	30,
	31,
];
const dayNames = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];
const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const increment = (key: string) => {
	if (key === "month") {
		selectedMonth.value = (selectedMonth.value + 1) % 12;
	}
};
const decrement = (key: string) => {
	if (key === "month") {
		selectedMonth.value = (selectedMonth.value + 11) % 12;
	}
};
const days = computed(() => {
	const days = [];
	const firstDay = new Date(selectedYear.value, selectedMonth.value, 1).getDay();
	const lastDay = daysInMonth[selectedMonth.value];
	for (let i = 0; i < firstDay; i++) {
		days.push("");
	}
	for (let i = 1; i <= lastDay; i++) {
		days.push(i);
	}
	return days;
});
const selectedDate = ref(new Date());
const selectDay = (day: number) => {
	selectedDate.value = new Date(selectedYear.value, selectedMonth.value, day);
	emits("daySelected", selectedDate.value);
};
</script>

<style scoped>
div {
	@apply dark:bg-darkBg bg-white text-primary dark:text-darkSecondary;
}
.chevron {
	@apply dark:hover:bg-black hover:bg-darkSecondary py-1 px-0 rounded-md hover:cursor-pointer trans;
}
</style>
