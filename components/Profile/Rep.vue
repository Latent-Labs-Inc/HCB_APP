<template>
	<div class="mx-4 mt-10">
		<div v-if="hasData" class="flex flex-col justify-center items-center">
			<div class="grid lg:grid-cols-4 sm:grid-cols-3 gap-5">
				<p>First Name: {{ salesRep.firstName }}</p>
				<p>Last Name: {{ salesRep.lastName }}</p>
				<p>Email: {{ salesRep.email }}</p>
				<p>Business Name: {{ salesRep.businessName }}</p>
				<p>Phone: {{ salesRep.phone }}</p>
			</div>
			<p class="flex text-xl mt-20">
				Please contact an admin to change your profile details
			</p>
		</div>
		<div class="flex justify-center items-center mt-36" v-else>
			<p class="flex text-xl">
				Please contact an admin to setup your profile details
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useProfileStore } from "~~/stores/profile";
import { SalesRep } from "~~/types/types";

const profileStore = useProfileStore();

const salesRep: SalesRep = profileStore.salesRep;

const hasData = ref(false);

if (!!salesRep) {
	hasData.value = true;
}

// const salesRep: SalesRep = ref(profileStore.salesRep);
</script>
