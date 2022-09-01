import { PatientInput, Insurance } from "~/types/types";

export default function useValidatePatientInput() {
	const input: PatientInput = reactive({
		firstName: {
			val: "",
			isValid: true,
		},
		lastName: {
			val: "",
			isValid: true,
		},
		address1: {
			val: "",
			isValid: true,
		},
		address2: {
			val: "",
			isValid: true,
		},
		city: {
			val: "",
			isValid: true,
		},
		state: {
			val: "",
			isValid: true,
		},
		postalCode: {
			val: "",
			isValid: true,
		},
		dob: {
			val: "",
			isValid: true,
		},
		gender: {
			val: "",
			isValid: true,
		},
		memberId: {
			val: "",
			isValid: true,
		},
		insurance: <Insurance>{
			memberId: "",
			isValid: false,
			planStatus: [],
			benefitsInformation: [],
		},
	});
	const formIsValid = ref(true);

	const validateInput = async () => {
		formIsValid.value = true;
		for (let key in input) {
			input[key].val = input[key].val?.toString().toLowerCase();
			if (
				key === "firstName" ||
				key === "lastName" ||
				key === "address1" ||
				key === "city"
			) {
				if (input[key].val?.length === 0) {
					input[key].isValid = false;
					formIsValid.value = false;
				}
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
		if (
			input.gender.val.length !== 1 ||
			!(input.gender.val === "m" || input.gender.val === "f")
		) {
			input.gender.isValid = false;
			formIsValid.value = false;
		}
		const dobIsValid = (dob) => {
			let dobRe = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/;
			return dobRe.test(dob);
		};

		if (!dobIsValid(input.dob.val)) {
			input.dob.isValid = false;
			formIsValid.value = false;
		}
	};
	return {
		validateInput,
		formIsValid,
		input,
	};
}

// export default function useValidatePatientInput(
// 	input: PatientInput,
// 	formIsValid
// ) {
// 	const validateInput = async () => {
// 		formIsValid.value = true;
// 		for (let key in input) {
// 			input[key].val = input[key].val?.toString().toLowerCase();
// 			if (
// 				key === "firstName" ||
// 				key === "lastName" ||
// 				key === "address1" ||
// 				key === "city"
// 			) {
// 				if (input[key].val?.length === 0) {
// 					input[key].isValid = false;
// 					formIsValid.value = false;
// 				}
// 			}
// 		}
// 		if (input.state.val.length !== 2) {
// 			input.state.isValid = false;
// 			formIsValid.value = false;
// 		}
// 		if (input.postalCode.val.length !== 5) {
// 			input.postalCode.isValid = false;
// 			formIsValid.value = false;
// 		}
// 		if (
// 			input.gender.val.length !== 1 ||
// 			!(input.gender.val === "m" || input.gender.val === "f")
// 		) {
// 			input.gender.isValid = false;
// 			formIsValid.value = false;
// 		}
// 		const dobIsValid = (dob) => {
// 			let dobRe = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/;
// 			return dobRe.test(dob);
// 		};

// 		if (!dobIsValid(input.dob.val)) {
// 			input.dob.isValid = false;
// 			formIsValid.value = false;
// 		}
// 	};
// 	return {
// 		validateInput,
// 	};
// }
