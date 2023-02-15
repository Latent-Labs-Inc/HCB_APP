import {
	ClearSkipProbate,
	ClearSkipRegular,
	PropSkipTrace,
	FormattedProbates,
} from '~~/types/types';

export const useEmailCampaignData = () => {
	const areContacts = computed(() => {
		// check if there are contacts in any of the arrays
		return (
			attorneys.value.length > 0 ||
			propstreamContacts.value.length > 0 ||
			clearSkipProbateContacts.value.length > 0 ||
			clearSkipRegularContacts.value.length > 0
		);
	});

	const clearSkipProbateContacts = ref<ClearSkipProbate[]>([]);
	const propstreamContacts = ref<PropSkipTrace[]>([]);
	const clearSkipRegularContacts = ref<ClearSkipRegular[]>([]);
	const attorneys = ref<FormattedProbates[]>([]);

	const formatData = (
		data: any[],
		skipTrace: 'propstream' | 'clearSkip_regular' | 'clearSkip_probate'
	) => {
		// I can choose to set up a basic interface for this and then use that to map the data to the correct keys and then push it to the contacts array and then use that to display the data
		if (skipTrace === 'propstream') {
			let formattedData = data.map((contact) => {
				let formattedContact = {} as PropSkipTrace;
				for (let key in contact) {
					// check if there is a colon and remove that
					let formattedKey = key
						.toLowerCase()
						.replace(/ /g, '_')
						.replace(':', '');
					// check if the key is blank and if so remove it, remove all that do not have an email
					if (formattedKey === '') {
						continue;
					}
					formattedContact[formattedKey as keyof PropSkipTrace] = contact[key]
						? contact[key]
						: null;
				}
				return formattedContact;
			});
			// remove all that do not have an email or first name or last name
			formattedData = formattedData.filter(
				(contact) =>
					contact.email_1 !== null &&
					contact.first_name !== null &&
					contact.last_name !== null
			);
			// now push the data to the propstream contacts array
			propstreamContacts.value.push(...formattedData);
		} else if (skipTrace === 'clearSkip_regular') {
			let formattedData = data.map((contact) => {
				let formattedContact = {} as ClearSkipRegular;
				for (let key in contact) {
					// check if there is a colon and remove that
					let formattedKey = key
						.toLowerCase()
						.replace(/ /g, '_')
						.replace(':', '');
					// check if the key is blank and if so remove it
					if (formattedKey === '') {
						continue;
					}
					formattedContact[formattedKey as keyof ClearSkipRegular] = contact[
						key
					]
						? contact[key].toLowerCase()
						: null;
				}
				return formattedContact;
			});
			// remove all that do not have an email or first name or last name
			formattedData = formattedData.filter(
				(contact) =>
					contact.email_email1 !== null &&
					contact.pr_first_name !== null &&
					contact.pr_last_name !== null
			);
			// now push the data to the clearskip regular contacts array
			clearSkipRegularContacts.value.push(...formattedData);
		} else if (skipTrace === 'clearSkip_probate') {
			let formattedData = data.map((contact) => {
				let formattedContact = {} as ClearSkipProbate;
				for (let key in contact) {
					// check if there is a colon and remove that
					let formattedKey = key
						.toLowerCase()
						.replace(/ /g, '_')
						.replace(':', '');
					// check if the key is blank and if so remove it
					if (formattedKey === '') {
						continue;
					}
					formattedContact[formattedKey as keyof ClearSkipProbate] = contact[
						key
					]
						? contact[key].toLowerCase()
						: null;
				}
				return formattedContact;
			});
			// remove all that do not have an email or first name or last name
			formattedData = formattedData.filter(
				(contact) =>
					contact.rel1_email_1 !== null &&
					contact.rel1_first_name !== null &&
					contact.rel1_last_name !== null
			);

			// now push the data to the clearSkip probate contacts array
			clearSkipProbateContacts.value.push(...formattedData);
		}
	};

	return {
		areContacts,
		clearSkipProbateContacts,
		propstreamContacts,
		clearSkipRegularContacts,
		attorneys,
		formatData,
	};
};
