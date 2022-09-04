import { Contact } from "~/types/types";
import { useAuthStore } from "~~/stores/auth";
import { useContactStore } from "~~/stores/contact";

export default async function useFormattedContacts(data: any[]) {
	const formattedContacts: Contact[] = [];

	const authStore = useAuthStore();

	const contactStore = useContactStore();

	let keys = Object.keys(data[0]);
	console.log(keys);
	data.forEach((contact) => {
		let newContact: Contact = {
			user_id: authStore.user_id,
			contact_id: useUuid(),
			created_at: new Date(),
			modified_at: new Date(),
			propertyAddress: {
				address1: null,
				address2: null,
				city: null,
				state: null,
				zip: null,
				county: null,
			},
			ownerAddress: {
				address1: null,
				address2: null,
				city: null,
				state: null,
				zip: null,
				county: null,
			},
			sqFt: null,
			yearBuilt: null,
			ownerFirstName: null,
			ownerLastName: null,
			wireless: [],
			landline: [],
			email: [],
			lastSaleDate: null,
			lastSalePrice: null,
			estimatedValue: null,
			foreclosure: null,
			homestead: null,
			senior: null,
			vacant: null,
			alternateContacts: null,
		};
		for (let key in contact) {
			contact[key] = contact[key].trim() || null;
			if (key.includes("e-mail")) {
				if (!!contact[key]) {
					newContact.email.push(contact[key]);
				}
			} else if (key.includes("wireless")) {
				if (!!contact[key]) {
					let newPhone = "+1" + contact[key].replace(/[^0-9]/g, "");
					newContact.wireless.push(newPhone);
				}
			} else if (key.includes("landline")) {
				if (!!contact[key]) {
					let newPhone = "+1" + contact[key].replace(/[^0-9]/g, "");
					newContact.landline.push(newPhone);
				}
			} else if (key.includes("property address")) {
				newContact.propertyAddress.address1 = contact[key];
			} else if (key.includes("property city")) {
				newContact.propertyAddress.city = contact[key];
			} else if (key.includes("property state")) {
				newContact.propertyAddress.state = contact[key];
			} else if (key.includes("property zip")) {
				newContact.propertyAddress.zip = contact[key];
			} else if (key.includes("property county")) {
				newContact.propertyAddress.county = contact[key];
			} else if (key.includes("owner address")) {
				console.log("owner address", contact[key]);
				newContact.ownerAddress.address1 = contact[key];
			} else if (key === "owner city") {
				newContact.ownerAddress.city = contact[key];
			} else if (key === "owner state") {
				newContact.ownerAddress.state = contact[key];
			} else if (key === "owner zip") {
				newContact.ownerAddress.zip = contact[key];
			} else if (key === "owner first name") {
				newContact.ownerFirstName = contact[key];
			} else if (key === "owner last name") {
				newContact.ownerLastName = contact[key];
			} else if (key.includes("square")) {
				newContact.sqFt = contact[key];
			} else if (key.includes("year" && "built")) {
				newContact.yearBuilt = contact[key];
			} else if (key.includes("last" && "sale" && "date")) {
				newContact.lastSaleDate = contact[key];
			} else if (key.includes("last" && "sale" && "price")) {
				newContact.lastSalePrice = contact[key];
			} else if (key.includes("estimated" && "value")) {
				newContact.estimatedValue = contact[key];
			} else if (key.includes("foreclosure")) {
				if (contact[key]?.includes("Y")) {
					newContact.foreclosure = true;
				} else if (contact[key]?.includes("N")) {
					newContact.foreclosure = false;
				} else {
					newContact.foreclosure = null;
				}
			} else if (key.includes("homestead")) {
				if (contact[key]?.includes("Y")) {
					newContact.homestead = true;
				} else if (contact[key]?.includes("N")) {
					newContact.homestead = false;
				} else {
					newContact.homestead = null;
				}
			} else if (key.includes("senior")) {
				if (contact[key]?.includes("Y")) {
					newContact.senior = true;
				} else if (contact[key]?.includes("N")) {
					newContact.senior = false;
				} else {
					newContact.senior = null;
				}
			} else if (key.includes("vacant")) {
				if (contact[key]?.includes("Y")) {
					newContact.vacant = true;
				} else if (contact[key]?.includes("N")) {
					newContact.vacant = false;
				} else {
					newContact.vacant = null;
				}
			} else if (key.includes("alternate" && "contacts")) {
				newContact.alternateContacts = contact[key];
			}
		}
		formattedContacts.push(newContact);
	});

	await contactStore.uploadContacts(formattedContacts);

	return formattedContacts;
}
