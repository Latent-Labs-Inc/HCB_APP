import { ChangeEligibility, EligibilityResponse } from "~~/types/change";
import { db } from "~/server/db/index";

export default defineEventHandler(async (event) => {
	// const query = useQuery(event);
	const subscriber = await useBody(event);
	const elig: ChangeEligibility = {
		controlNumber: "123456789",
		tradingPartnerServiceId: "00003",
		provider: {
			organizationName: "happy doctors group",
			npi: "1760854442",
		},
		subscriber: {
			memberId: "0000000000",
			firstName: "johnOne",
			lastName: "doeOne",
			gender: "M",
			dateOfBirth: "18800102",
			ssn: "555443333",
		},
		dependents: [
			{
				firstName: "janeOne",
				lastName: "doeone",
				gender: "F",
				dateOfBirth: "18160421",
				groupNumber: "1111111111",
			},
		],
		encounter: {
			beginningDateOfService: "20100101",
			endDateOfService: "20100102",
			serviceTypeCodes: ["98"],
		},
	};
	if (db.changeToken.expires_at < Date.now()) {
		await $fetch("/api/changeAuth");
	}
	const changeToken = db.changeToken;
	try {
		const changeEligibilityUrl = `https://sandbox.apigw.changehealthcare.com/medicalnetwork/eligibility/v3`;
		const eligibilityRes: EligibilityResponse = await $fetch(
			changeEligibilityUrl,
			{
				headers: {
					Authorization: `Bearer ${changeToken.access_token}`,
					"Content-Type": "application/json",
				},
				method: "POST",
				body: elig,
			}
		);
		return eligibilityRes;
	} catch (e) {
		console.log(e);
	}
});
