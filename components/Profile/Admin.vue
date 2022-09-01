<template>
	<div v-if="authStore.isAdmin">
		<UiRadio :radioTypes="radioTypes" v-model="selectedRadio" />
		<UiSearchInline
			:label="'Profiles'"
			v-model="searchInput"
			@search="searchProfiles"
		/>
		<transition name="fade" mode="out-in">
			<div v-if="selectedProfile !== null">
				<UiRadio :radioTypes="radioTypes" v-model="selectedRadio" />
				<transition name="fade" mode="out-in">
					<ProfilePractice
						v-if="selectedRadio === 'practice'"
						@toRep="handleRadioChange('salesRep')"
					/>
					<ProfileRep v-else-if="selectedRadio === 'salesRep'" />
				</transition>
			</div>
		</transition>
		<div>
			<UiTable
				:cols="cols"
				:gridCols="gridCols"
				:tableData="profiles"
				:properties="properties"
				:dropdownItems="dropdownItems"
				@itemClicked="handleItemClick"
				:pageLength="10"
				:key="componentKey"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useProfileStore } from "~/stores/profile";
import { useAuthStore } from "~/stores/auth";
import { Profile } from "~/types/types";

const searchInput = ref("");
const profileStore = useProfileStore();
const authStore = useAuthStore();
const router = useRouter();

const radioTypes = [
	{
		id: "practice",
		label: "Practice",
	},
	{
		id: "salesRep",
		label: "Sales Rep",
	},
];

const cols = ref(["Type", "Username", "Email"]);

const properties = ref(["type", "username", "email", "dropdown"]);

const gridCols = ref("grid-cols-4");

const componentKey = ref(0);

const forceUpdate = () => {
	componentKey.value++;
};

const dropdownItems = ref([
	{
		id: "edit",
		label: "Edit Profile",
	},
	{
		id: "key",
		label: "Key",
	},
	{
		id: "reset",
		label: "Reset password",
	},
]);

const handleItemClick = async (event, row) => {
	if (event.id === "edit") {
		await profileStore.setAdminSelectedProfile(row);
		router.push(`/profile/edit/${row.type}/${row.user_id}`);
	} else if (event.id === "key") {
		console.log("key");
	} else if (event.id === "reset") {
		console.log("reset");
	}
};

const selectedRadio = ref(radioTypes[0].id);
const handleRadioChange = (radioType: string) => {
	selectedRadio.value = radioType;
};
const selectedProfile = ref<Profile | null>(null);
const profiles = ref([] as Profile[]);

const searchProfiles = async () => {
	// search by name

	if (authStore.isAdmin) {
		profiles.value = await profileStore.adminSearchProfiles(
			searchInput.value,
			selectedRadio.value
		);
		forceUpdate();
	}
};
</script>
