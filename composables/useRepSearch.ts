import { useProfileStore } from "~~/stores/profile";
import { SalesRep } from "~~/types/types";

export default function useRepSearch() {
	const profileStore = useProfileStore();

	const reps = ref([] as SalesRep[]);

	const repSelected = ref(false);
	const repSearchInput = ref("");
	const selectedRep = ref(null);
	const handleSearch = async () => {
		console.log("searching");
		reps.value = await profileStore.adminSearchReps(repSearchInput.value);
	};

	const listTitles = ref(["firstName", "lastName", "phone", "businessName"]);

	const changeRep = () => {
		repSelected.value = false;
		selectedRep.value = null;
	};

	const handleSelected = async (rep) => {
		repSelected.value = true;
		selectedRep.value = rep;
	};

	return {
		reps,
		repSelected,
		repSearchInput,
		selectedRep,
		listTitles,
		handleSearch,
		changeRep,
		handleSelected,
	};
}
