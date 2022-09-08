import { Lead } from "~/types/types";
import { useAuthStore } from "~~/stores/auth";
import { useLeadStore } from "~~/stores/lead";

export default async function useFormattedLeads(data: any[]) {
	const formattedLeads: Lead[] = [];

	const authStore = useAuthStore();

	const leadStore = useLeadStore();

	let keys = Object.keys(data[0]);
	console.log(data[0]);
	console.log(keys);

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
					address1: lead["Property Address"],
					address2: null,
					city: lead["Property City"],
					state: lead["Property State"],
					zip: lead["Property Zip"],
					county: lead["County"],
				},
				ownerFirstName: lead["First Name"],
				ownerLastName: lead["Last Name"],
				prAddress: {
					address1: lead["PR Address"],
					address2: null,
					city: lead["PR City"],
					state: lead["PR State"],
					zip: lead["PR Zip"],
				},
				prFirstName: lead["PR First Name"],
				prLastName: lead["PR Last Name"],
				mailingAddress: {
					address1: lead["Mailing Address"],
					address2: null,
					city: lead["Mailing City"],
					state: lead["Mailing State"],
					zip: lead["Mailing Zip"],
				},
				wireless: [],
				landline: [],
				email: [],
				leadProvider: leadStore.leadProvider,
				leadType: leadStore.leadType,
				texted: false,
				emailed: false,
				mailed: false,
				fileDate: lead["File Date"],
			};
			// if (lead.fileDate) {

			// }
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
				mailingAddress: {
					address1: null,
					address2: null,
					city: null,
					state: null,
					zip: null,
				},
			};
			for (let key in lead) {
				let lowerCaseKey = key.toLowerCase();
				lead[key] = lead[key].trim() || null;
				if (lowerCaseKey.includes("e-mail")) {
					if (!!lead[key]) {
						newLead.email.push(lead[key]);
					}
				} else if (lowerCaseKey.includes("wireless")) {
					if (!!lead[key]) {
						let newPhone = "+1" + lead[key].replace(/[^0-9]/g, "");
						newLead.wireless.push(newPhone);
					}
				} else if (lowerCaseKey.includes("landline")) {
					if (!!lead[key]) {
						let newPhone = "+1" + lead[key].replace(/[^0-9]/g, "");
						newLead.landline.push(newPhone);
					}
				} else if (lowerCaseKey.includes("property address")) {
					newLead.propertyAddress.address1 = lead[key];
				} else if (lowerCaseKey.includes("property city")) {
					newLead.propertyAddress.city = lead[key];
				} else if (lowerCaseKey.includes("property state")) {
					newLead.propertyAddress.state = lead[key];
				} else if (lowerCaseKey.includes("property zip")) {
					newLead.propertyAddress.zip = lead[key];
				} else if (lowerCaseKey.includes("property county")) {
					newLead.propertyAddress.county = lead[key];
				} else if (lowerCaseKey === "owner first name") {
					newLead.ownerFirstName = lead[key];
				} else if (lowerCaseKey === "owner last name") {
					newLead.ownerLastName = lead[key];
				}
			}
			formattedLeads.push(newLead);
		});
	}
	console.log(formattedLeads);
	await leadStore.uploadLeads(formattedLeads);

	return formattedLeads;
}
