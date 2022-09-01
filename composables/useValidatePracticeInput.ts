import { PracticeInput } from "~/types/types";

export default function useValidatePracticeInput(input: PracticeInput) {
	const formIsValid = ref(true);

	const validateInput = async () => {
		formIsValid.value = true;
		for (let key in input) {
			input[key].val = input[key].val?.toString().toLowerCase();
			if (input[key].val?.length === 0) {
				input[key].isValid = false;
				formIsValid.value = false;
			}
		}
		if (input.state.val.length !== 2) {
			input.state.isValid = false;
			formIsValid.value = false;
		}
		if (input.postalCode.val.length !== 5) {
			input.postalCode.isValid = false;
			formIsValid.value = false;
		}
	};
	return {
		validateInput,
		formIsValid,
	};
}
