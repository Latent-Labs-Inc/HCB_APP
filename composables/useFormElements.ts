import { FormElement } from "~/types/types";

export default function useFormElements(input) {
	const formElements = ref([] as FormElement[]);
	const createElements = () => {
		for (let key in input) {
			let error = "";
			let placeholder = "";
			let required = true;
			let text = key.replace(/([A-Z])/g, " $1");
			let title = text.charAt(0).toUpperCase() + text.slice(1);
			if (key === "groupNpi") {
				placeholder = "Group NPI";
				title = "Group NPI";
			} else if (key === "ein" || key === "ptan") {
				placeholder = key.toUpperCase();
				title = key.toUpperCase();
			} else if (key === "address2") {
				required = false;
			}
			formElements.value.push({
				id: key,
				title: title,
				required: required,
				error: error,
				placeholder: placeholder,
			} as FormElement);
		}
	};

	createElements();

	const resetValidity = (id: string) => {
		input[id].isValid = true;
	};
	return {
		formElements,
		resetValidity,
	};
}
