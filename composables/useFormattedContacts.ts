import { Contact } from "~/types/types";
import { useAuthStore } from "~~/stores/auth";

export default function useFormattedContacts(data: any[]) {
	const formattedContacts: Contact[] = [];
	const authStore = useAuthStore();
	console.log(data[0]);
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
			isForeclosure: null,
			isHomestead: null,
			isSenior: null,
			isVacant: null,
			alternateContacts: null,
		};
		for (let key in contact) {
			if (key.includes("e-mail")) {
				newContact.email.push(contact[key]);
			} else if (key.includes("wireless")) {
				if (!!contact[key]) {
					newContact.wireless.push(contact[key]);
				}
			} else if (key.includes("landline")) {
				if (!!contact[key]) {
					newContact.landline.push(contact[key]);
				}
			} else if (key.includes("property" && "address")) {
				newContact.propertyAddress.address1 = contact[key];
			} else if (key.includes("property" && "city")) {
				console.log("includes property and city");
				newContact.propertyAddress.city = contact[key];
			} else if (key.includes("property" && "state")) {
				newContact.propertyAddress.state = contact[key];
			} else if (key.includes("property" && "zip")) {
				newContact.propertyAddress.zip = contact[key];
			} else if (key.includes("property" && "county")) {
				newContact.propertyAddress.county = contact[key];
			} else if (key.includes("owner" && "address")) {
				newContact.ownerAddress.address1 = contact[key];
			} else if (key.includes("owner" && "city")) {
				newContact.ownerAddress.city = contact[key];
			} else if (key.includes("owner" && "state")) {
				newContact.ownerAddress.state = contact[key];
			} else if (key.includes("owner" && "zip")) {
				newContact.ownerAddress.zip = contact[key];
			} else if (key.includes("owner" && "county")) {
				newContact.ownerAddress.county = contact[key];
			} else if (key.includes("owner" && "first" && "name")) {
				newContact.ownerFirstName = contact[key];
			} else if (key.includes("owner" && "last" && "name")) {
				newContact.ownerLastName = contact[key];
			} else if (key.includes("sq" && "ft")) {
				newContact.sqFt = contact[key];
			} else if (key.includes("year" && "built")) {
				newContact.yearBuilt = contact[key];
			} else if (key.includes("last" && "sale" && "date")) {
				newContact.lastSaleDate = contact[key];
			} else if (key.includes("last" && "sale" && "price")) {
				newContact.lastSalePrice = contact[key];
			} else if (key.includes("estimated" && "value")) {
				newContact.estimatedValue = contact[key];
			} else if (key.includes("is" && "foreclosure")) {
				newContact.isForeclosure = contact[key];
			} else if (key.includes("is" && "homestead")) {
				newContact.isHomestead = contact[key];
			} else if (key.includes("is" && "senior")) {
				newContact.isSenior = contact[key];
			} else if (key.includes("is" && "vacant")) {
				newContact.isVacant = contact[key];
			} else if (key.includes("alternate" && "contacts")) {
				newContact.alternateContacts = contact[key];
			}
		}
		formattedContacts.push(newContact);
	});
	console.log(formattedContacts);
}
