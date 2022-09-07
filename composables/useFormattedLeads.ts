import { Lead } from "~/types/types";
import { useAuthStore } from "~~/stores/auth";
import { useLeadStore } from "~~/stores/lead";

export default async function useFormattedLeads(data: any[]) {
	const formattedLeads: Lead[] = [];

	const authStore = useAuthStore();

	const leadStore = useLeadStore();

	let keys = Object.keys(data[0]);
	console.log(data[0]);

	if (
		leadStore.leadProvider === "foreclosureDaily" &&
		leadStore.leadType === "probate"
	) {
		data.forEach((lead) => {
			let newLead: Lead = {
				user_id: authStore.user_id,
				lead_id: useUuid(),
				created_at: new Date(),
				modified_at: new Date(),
				propertyAddress: {
					address1: lead["property address"],
					address2: null,
					city: lead["property city"],
					state: lead["property state"],
					zip: lead["property zip"],
					county: lead["county"],
				},
				ownerFirstName: lead["first name"],
				ownerLastName: lead["last name"],
				wireless: [],
				landline: [],
				email: [],
				leadProvider: leadStore.leadProvider,
				leadType: leadStore.leadType,
				texted: false,
				emailed: false,
				mailed: false,
				fileDate: null,
			};
			formattedLeads.push(newLead);
		});
	} else if (
		leadStore.leadProvider === "fiverr" &&
		leadStore.leadType === "highEquity"
	) {
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
				ownerFirstName: null,
				ownerLastName: null,
				wireless: [],
				landline: [],
				email: [],
				leadProvider: leadStore.leadProvider,
				leadType: leadStore.leadType,
				texted: false,
				emailed: false,
				mailed: false,
				fileDate: null,
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
				} else if (key === "owner first name") {
					newLead.ownerFirstName = lead[key];
				} else if (key === "owner last name") {
					newLead.ownerLastName = lead[key];
				}
			}
			formattedLeads.push(newLead);
		});
	}

	await leadStore.uploadLeads(formattedLeads);

	return formattedLeads;
}
