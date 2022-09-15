import { Lead } from "~/types/types";
import { useAuthStore } from "~~/stores/auth";
import { useLeadStore } from "~~/stores/lead";

export default async function useFormattedLeads(data: any[]) {
	const formattedLeads: Lead[] = [];

	const authStore = useAuthStore();

	const leadStore = useLeadStore();

	console.log(leadStore.leadProvider, leadStore.leadType);

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
					address1: lead["Property Address"],
					address2: !!lead["Property Address 2"] ? lead["Property Address 2"] : null,
					city: lead["Property City"],
					state: lead["Property State"],
					zip: lead["Property Zip"],
					county: lead["Property County"],
				},
				ownerFirstName: lead["Owner First Name"],
				ownerLastName: lead["Owner Last Name"],
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
					address1: lead["Owner Address"],
					address2: !!lead["Owner Address 2"] ? lead["Owner Address 2"] : null,
					city: lead["Owner City"],
					state: lead["Owner State"],
					zip: lead["Owner Zip"],
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
				}
			}
			formattedLeads.push(newLead);
		});
	} else if (
		leadStore.leadProvider === "fiverr" &&
		leadStore.leadType === "absentee"
	) {
		data.forEach((lead) => {
			let newLead: Lead = {
				user_id: authStore.user_id,
				lead_id: useUuid(),
				created_at: new Date(),
				modified_at: new Date(),
				propertyAddress: {
					address1: lead["Property Address"],
					address2: !!lead["Property Address 2"] ? lead["Property Address 2"] : null,
					city: lead["Property City"],
					state: lead["Property State"],
					zip: lead["Property Zip"],
					county: lead["Property County"],
				},
				ownerFirstName: lead["Owner First Name"],
				ownerLastName: lead["Owner Last Name"],
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
					address1: lead["Owner Address"],
					address2: !!lead["Owner Address 2"] ? lead["Owner Address 2"] : null,
					city: lead["Owner City"],
					state: lead["Owner State"],
					zip: lead["Owner Zip"],
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
				}
			}
			formattedLeads.push(newLead);
		});
	} else if (leadStore.leadProvider === "propStream") {
		data.forEach((lead) => {
			if (!!lead["Company Name"]) {
			} else {
				let newLead: Lead = {
					user_id: authStore.user_id,
					lead_id: useUuid(),
					created_at: new Date(),
					modified_at: new Date(),
					propertyAddress: {
						address1: lead["Street Address"],
						address2: !!lead["Street Address 2"] ? lead["Street Address 2"] : null,
						city: lead["City"],
						state: lead["State"],
						zip: lead["Zip"],
						county: !!lead["County"] ? lead["County"] : null,
					},
					ownerFirstName: lead["First Name"],
					ownerLastName: lead["Last Name"],
					wireless: [],
					landline: [],
					email: [],
					prFirstName: lead["First Name"],
					prLastName: lead["Last Name"],
					leadProvider: leadStore.leadProvider,
					leadType: leadStore.leadType,
					texted: false,
					emailed: false,
					mailed: false,
					fileDate: null,
					mailingAddress: {
						address1: lead["Mail Street Address"],
						address2: !!lead["Mail Street Address 2"]
							? lead["Mail Street Address 2"]
							: null,
						city: lead["Mail City"],
						state: lead["Mail State"],
						zip: lead["Mail Zip"],
					},
				};
				for (let key in lead) {
					let lowerCaseKey = key.toLowerCase();
					lead[key] = lead[key].trim() || null;
					if (lowerCaseKey.includes("e mail")) {
						if (!!lead[key]) {
							newLead.email.push(lead[key]);
						}
					} else if (
						lowerCaseKey.includes("cell") ||
						lowerCaseKey.includes("phone") ||
						lowerCaseKey.includes("mobile")
					) {
						if (!!lead[key]) {
							let newPhone = "+1" + lead[key].replace(/[^0-9]/g, "");
							newLead.wireless.push(newPhone);
						}
					} else if (lowerCaseKey.includes("landline")) {
						if (!!lead[key]) {
							let newPhone = "+1" + lead[key].replace(/[^0-9]/g, "");
							newLead.landline.push(newPhone);
						}
					}
				}
				formattedLeads.push(newLead);
			}
		});
	}
	console.log(formattedLeads);
	await leadStore.uploadLeads(formattedLeads);

	return formattedLeads;
}
