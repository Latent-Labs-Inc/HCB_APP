import { Lead } from "~/types/types";
import { useAuthStore } from "~~/stores/auth";
import { useLeadStore } from "~~/stores/lead";

export default async function useFormattedLeads(data: any[]) {
	const formattedLeads: Lead[] = [];

	const authStore = useAuthStore();

	const leadStore = useLeadStore();

	let keys = Object.keys(data[0]);

	data.forEach((lead) => {
		let newLead: Lead = {
			user_id: authStore.user_id,
			lead_id: useUuid(),
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
			leadProvider: leadStore.leadProvider,
			leadType: leadStore.leadType,
		};
		for (let key in lead) {
			lead[key] = lead[key].trim() || null;
			if (key.includes("e-mail")) {
				if (!!lead[key]) {
					newLead.email.push(lead[key]);
				}
			} else if (key.includes("wireless")) {
				if (!!lead[key]) {
					let newPhone = "+1" + lead[key].replace(/[^0-9]/g, "");
					newLead.wireless.push(newPhone);
				}
			} else if (key.includes("landline")) {
				if (!!lead[key]) {
					let newPhone = "+1" + lead[key].replace(/[^0-9]/g, "");
					newLead.landline.push(newPhone);
				}
			} else if (key.includes("property address")) {
				newLead.propertyAddress.address1 = lead[key];
			} else if (key.includes("property city")) {
				newLead.propertyAddress.city = lead[key];
			} else if (key.includes("property state")) {
				newLead.propertyAddress.state = lead[key];
			} else if (key.includes("property zip")) {
				newLead.propertyAddress.zip = lead[key];
			} else if (key.includes("property county")) {
				newLead.propertyAddress.county = lead[key];
			} else if (key.includes("owner address") && !!lead[key]) {
				newLead.ownerAddress.address1 = lead[key];
			} else if (key === "owner city") {
				newLead.ownerAddress.city = lead[key];
			} else if (key === "owner state") {
				newLead.ownerAddress.state = lead[key];
			} else if (key === "owner zip") {
				newLead.ownerAddress.zip = lead[key];
			} else if (key === "owner first name") {
				newLead.ownerFirstName = lead[key];
			} else if (key === "owner last name") {
				newLead.ownerLastName = lead[key];
			} else if (key.includes("square")) {
				newLead.sqFt = lead[key];
			} else if (key.includes("year" && "built")) {
				newLead.yearBuilt = lead[key];
			} else if (key.includes("last" && "sale" && "date")) {
				newLead.lastSaleDate = lead[key];
			} else if (key.includes("last" && "sale" && "price")) {
				newLead.lastSalePrice = lead[key];
			} else if (key.includes("estimated" && "value")) {
				newLead.estimatedValue = lead[key];
			} else if (key.includes("foreclosure")) {
				if (lead[key]?.includes("Y")) {
					newLead.foreclosure = true;
				} else if (lead[key]?.includes("N")) {
					newLead.foreclosure = false;
				} else {
					newLead.foreclosure = null;
				}
			} else if (key.includes("homestead")) {
				if (lead[key]?.includes("Y")) {
					newLead.homestead = true;
				} else if (lead[key]?.includes("N")) {
					newLead.homestead = false;
				} else {
					newLead.homestead = null;
				}
			} else if (key.includes("senior")) {
				if (lead[key]?.includes("Y")) {
					newLead.senior = true;
				} else if (lead[key]?.includes("N")) {
					newLead.senior = false;
				} else {
					newLead.senior = null;
				}
			} else if (key.includes("vacant")) {
				if (lead[key]?.includes("Y")) {
					newLead.vacant = true;
				} else if (lead[key]?.includes("N")) {
					newLead.vacant = false;
				} else {
					newLead.vacant = null;
				}
			} else if (key.includes("alternate" && "leads")) {
				newLead.alternateContacts = lead[key];
			}
		}
		formattedLeads.push(newLead);
	});

	await leadStore.uploadLeads(formattedLeads);

	return formattedLeads;
}
