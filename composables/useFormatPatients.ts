import { Patient } from "~/types/types";
import { useAuthStore } from "~~/stores/auth";
import { useUiStore } from "~~/stores/ui";
import useUuid from "./useUuid";

const useFormatPatients = (type: "csv" | "xlsx", patients: Patient[]) => {
	const authStore = useAuthStore();
	const uiStore = useUiStore();
	const newPatients: Patient[] = [];
	// Need to format all the inputs properly
	if (type === "csv") {
		patients.forEach((patient) => {
			const newPat: Patient = {
				firstName: "",
				lastName: "",
				dob: "",
				address: {
					address1: "",
					address2: "",
					city: "",
					state: "",
					postalCode: "",
				},
				gender: "",
				user_id: "",
				patient_id: "",
				insurance: {
					memberId: patient.insurance?.memberId,
					benefitsInformation: [],
					planStatus: [],
					isValid: false,
				},
				created_at: new Date(),
				modified_at: new Date(),
			};
			for (let key in patient) {
				let value = patient[key];
				value = value.toString().toLowerCase();
				key = key.toLowerCase();
				if (key.includes("first")) {
					newPat.firstName = value ? value : "";
				} else if (key.includes("last")) {
					newPat.lastName = value ? value : "";
				} else if (key.includes("address" || "street")) {
					if (key.includes("2")) {
						newPat.address.address2 = value ? value : "";
					} else {
						newPat.address.address1 = value ? value : "";
					}
				} else if (key.includes("city")) {
					newPat.address.city = value ? value : "";
				} else if (key.includes("state")) {
					newPat.address.state = value ? value : "";
				} else if (key.includes("zip" || "postal")) {
					newPat.address.postalCode = value ? value : "";
				} else if (key.includes("dob")) {
					// you need to format date of birth so that you can know if either 19 or 20 is being used if they only put the last two digits of the year
					if (value.includes("/")) {
						value = value.split("/");
						if (value[0].length === 1) {
							value[0] = "0" + value[0];
						}
						if (value[1].length === 1) {
							value[1] = "0" + value[1];
						}

						newPat.dob = value[0] + "/" + value[1] + "/" + value[2];
					} else if (value.includes("-")) {
						let dateArr = value.split("-");
						newPat.dob = dateArr[0] + "/" + dateArr[1] + "/" + dateArr[2];
					} else {
						newPat.dob = value;
					}
				} else if (key.includes("gender" || "sex")) {
					newPat.gender = value ? value.charAt(0) : "";
				} else if (key.includes("member")) {
					newPat.insurance.memberId = value ? value : "";
				}
			}
			const user_id = authStore.user_id;
			newPat.user_id = user_id;
			let patientId = useUuid();
			// Check if ID has already been used
			for (let i = 0; i < newPatients.length; i++) {
				const patient = newPatients[i];
				if (patient.patient_id === patientId) {
					patientId = useUuid();
				}
			}
			newPat.patient_id = patientId;
			newPatients.push(newPat);
		});
		return newPatients;
	}
	// else if (type === "xlsx") {
	// 	for (let i = 0; i < patients.length; i++) {
	// 		const pat = patients[i];
	// 		const newPat = <Patient>{};
	// 		for (let key in pat) {
	// 			let value = pat[key];
	// 			value = value.toString().toLowerCase();
	// 			key = key.toLowerCase();
	// 			if (key.includes("first")) {
	// 				newPat.firstName = value;
	// 			} else if (key.includes("last")) {
	// 				newPat.lastName = value;
	// 			} else if (key.includes("address" || "street")) {
	// 				if (key.includes("address2")) {
	// 					newPat.address.address2 = value;
	// 				} else {
	// 					newPat.address.address1 = value;
	// 				}
	// 			} else if (key.includes("city")) {
	// 				newPat.address.city = value;
	// 			} else if (key.includes("state")) {
	// 				newPat.address.state = value;
	// 			} else if (key.includes("zip")) {
	// 				newPat.address.postalCode = value;
	// 			} else if (key.includes("phone")) {
	// 				newPat.phone = value;
	// 			} else if (key.includes("dob")) {
	// 				if (value.includes("/")) {
	// 					newPat.dob = value;
	// 				}
	// 				if (value.includes("-")) {
	// 					let dateArr = value.split("-");
	// 					newPat.dob = dateArr[0] + "/" + dateArr[1] + "/" + dateArr[2];
	// 				} else {
	// 					if (value.length === 8) {
	// 						newPat.dob =
	// 							value[0] +
	// 							value[1] +
	// 							"/" +
	// 							value[2] +
	// 							value[3] +
	// 							"/" +
	// 							value[4] +
	// 							value[5] +
	// 							value[6] +
	// 							value[7];
	// 					}
	// 					if (value.length === 7) {
	// 						console.log("missing 0 at start");
	// 						newPat.dob =
	// 							"0" +
	// 							value[0] +
	// 							"/" +
	// 							value[1] +
	// 							value[2] +
	// 							"/" +
	// 							value[3] +
	// 							value[4] +
	// 							value[5] +
	// 							value[6];
	// 					}
	// 				}
	// 			} else if (key.includes("gender" || "sex")) {
	// 				newPat.gender = value.charAt(0);
	// 			}
	// 		}
	// 		newPat.insurance = {
	// 			memberId: "",
	// 			isValid: false,
	// 		};
	// 		newPat.created_at = new Date();
	// 		const user_id = authStore.user_id;
	// 		newPat.user_id = user_id;
	// 		let patientId = useUuid();
	// 		// Check if ID has already been used
	// 		for (let i = 0; i < newPatients.length; i++) {
	// 			const patient = newPatients[i];
	// 			if (patient.patient_id === patientId) {
	// 				patientId = useUuid();
	// 			}
	// 		}
	// 		newPat.patient_id = patientId;
	// 		newPatients.push(newPat);
	// 	}

	// 	setTimeout(() => {
	// 		uiStore.toggleAppLoading(false);
	// 	}, 3000);
	// 	return newPatients;
	// }
};

export default useFormatPatients;
