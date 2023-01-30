import { FD_Probate } from '~/types/types';
import { useAuthStore } from '~~/stores/auth';

export const useProbateFormatter = async (probates: FD_Probate[]) => {
	const formattedProbates = probates.map((probate) => {
		const formattedProbate = {
			user_id: useAuthStore().user_id,
			id: useUuid(),
			filing_date: probate['Filing Date'].split('/').reverse().join('-'),
			deceased_first: probate['First Name (Deceased)'],
			deceased_last: probate['Last Name'],
			address1: probate['Property Address'],
			city: probate['Property City'],
			state: probate['Property State'],
			zip: probate['Property Zip'],
			pr_first: probate['PR First Name'],
			pr_last: probate['PR Last Name'],
			pr_address1: probate['PR Address'],
			pr_city: probate['PR City'],
			pr_state: probate['PR State'],
			pr_zip: probate['PR Zip'],
			pr_phone: probate['PR Ph Number'],
			attorney_first: probate['Attorney First Name'],
			attorney_last: probate['Attorney Last Name'],
			attorney_address1: probate['Attorney Address'],
			attorney_city: probate['Attorney City'],
			attorney_state: probate['Attorney State'],
			attorney_zip: probate['Attorney Zip'],
			attorney_phone: probate['Attorney Ph Number'],
			attorney_email: probate['Attorney Email ID'],
			created_at: new Date(),
			modified_at: new Date(),
		};
		return formattedProbate;
	});
	return formattedProbates;
};
