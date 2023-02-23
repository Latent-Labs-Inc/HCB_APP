import {
	ClearSkipProbate,
	ClearSkipRegular,
	PropSkipTrace,
	FormattedProbates,
	EmailObject,
	AttorneyEmailObject,
} from '~~/types/types';
import { useUiStore } from '~~/stores/ui';
import { Database } from '~~/types/supabase';

export const useEmailCampaignData = () => {
	const uiStore = useUiStore();
	const client = useSupabaseClient<Database>();
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
			return formattedData;
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
			return formattedData;
		}
	};

	const formatClearSkipProbate = (contacts: ClearSkipProbate[]) => {
		let emailObjects = [] as EmailObject[];
		// will want to get all the rel emails and send them an email
		// check if there is an email for all of the rel keys
		const getRelativeEmails = (contact: ClearSkipProbate) => {
			let relatives = [] as {
				emails: string[];
				first_name: string;
				last_name: string;
			}[];
			if (contact.rel1_email_1) {
				// check if there are additional emails for rel1
				// if so add them to the array
				let emails = [contact.rel1_email_1];
				if (contact.rel1_email_2) emails.push(contact.rel1_email_2);
				if (contact.rel1_email_3) emails.push(contact.rel1_email_3);
				relatives.push({
					emails,
					first_name: contact.rel1_first_name,
					last_name: contact.rel1_last_name,
				});
			}
			if (contact.rel2_email_1) {
				// check if there are additional emails for rel1
				// if so add them to the array
				let emails = [contact.rel2_email_1];
				if (contact.rel2_email_2) emails.push(contact.rel2_email_2);
				if (contact.rel2_email_3) emails.push(contact.rel2_email_3);
				relatives.push({
					emails,
					first_name: contact.rel2_first_name,
					last_name: contact.rel2_last_name,
				});
			}
			if (contact.rel3_email_1) {
				// check if there are additional emails for rel1
				// if so add them to the array
				let emails = [contact.rel3_email_1];
				if (contact.rel3_email_2) emails.push(contact.rel3_email_2);
				if (contact.rel3_email_3) emails.push(contact.rel3_email_3);
				relatives.push({
					emails,
					first_name: contact.rel3_first_name,
					last_name: contact.rel3_last_name,
				});
			}
			if (contact.rel4_email_1) {
				// check if there are additional emails for rel1
				// if so add them to the array
				let emails = [contact.rel4_email_1];
				if (contact.rel4_email_2) emails.push(contact.rel4_email_2);
				if (contact.rel4_email_3) emails.push(contact.rel4_email_3);
				relatives.push({
					emails,
					first_name: contact.rel4_first_name,
					last_name: contact.rel4_last_name,
				});
			}
			if (contact.rel5_email_1) {
				// check if there are additional emails for rel1
				// if so add them to the array
				let emails = [contact.rel5_email_1];
				if (contact.rel5_email_2) emails.push(contact.rel5_email_2);
				if (contact.rel5_email_3) emails.push(contact.rel5_email_3);
				relatives.push({
					emails,
					first_name: contact.rel5_first_name,
					last_name: contact.rel5_last_name,
				});
			}
			// remove duplicates
			relatives = relatives.filter((rel, index, self) => {
				return (
					index ===
					self.findIndex(
						(t) =>
							t.first_name === rel.first_name && t.last_name === rel.last_name
					)
				);
			});
			return relatives;
		};

		contacts.forEach((contact) => {
			// get the relatives for each contact
			let relatives = getRelativeEmails(contact);
			// now we have all the relatives and we will create an email object for each relative
			// create a function that capitalizes the first letter of the string\
			const capitalizeFirstLetter = (string: string) => {
				return string.charAt(0).toUpperCase() + string.slice(1);
			};
			relatives.forEach((rel) => {
				// create an email object for each relative
				rel.emails.forEach((email) => {
					// convert the first letter of the first name to uppercase
					let first_name = capitalizeFirstLetter(rel.first_name);
					let last_name = capitalizeFirstLetter(rel.last_name);
					let name = `${first_name} ${last_name}`;
					let emailObject: EmailObject = {
						email,
						subject: `Important for ${name}`,
						name,
						address1: capitalizeFirstLetter(contact.input_address_1),
						city: capitalizeFirstLetter(contact.input_city),
						state: capitalizeFirstLetter(contact.input_state),
						zip: contact.input_zip_code,
					};
					emailObjects.push(emailObject);
				});
			});
		});
		return emailObjects;
	};

	const formatClearSkipRegular = (
		contacts: ClearSkipRegular[],
		type: 'probate' | 'codeViolation' | 'eviction' | 'cashOffer'
	) => {
		// clear skip regular
		// get the contacts
		// create an array of email objects
		let emailObjects: EmailObject[] = [];
		// create a function that capitalizes the first letter of the string
		const capitalizeFirstLetter = (string: string) => {
			return string.charAt(0).toUpperCase() + string.slice(1);
		};
		// loop through the contacts
		contacts.forEach((contact) => {
			// each contact will have multiple available email fields so you will need to check each of the fields for an email
			for (let key in contact) {
				if (key.includes('email_email')) {
					// check if the value is not null
					if (contact[key as keyof typeof contact]) {
						const subject = computed(() => {
							if (type === 'probate') {
								return `Important for ${capitalizeFirstLetter(
									contact.input_first_name
								)} ${capitalizeFirstLetter(contact.input_last_name)}`;
							} else if (type === 'codeViolation') {
								return 'Help with your code violations';
							} else if (type === 'eviction') {
								return 'Help with your eviction situation';
							} else {
								return `Important for ${capitalizeFirstLetter(
									contact.input_first_name
								)} ${capitalizeFirstLetter(contact.input_last_name)}`;
							}
						});
						// create an email object
						let emailObject: EmailObject = {
							email: contact[key as keyof typeof contact],
							subject: subject.value,
							name: `${capitalizeFirstLetter(
								contact.input_first_name
							)} ${capitalizeFirstLetter(contact.input_last_name)}`,
							address1: capitalizeFirstLetter(contact.input_address_1),
							city: capitalizeFirstLetter(contact.input_city),
							state: capitalizeFirstLetter(contact.input_state),
							zip: contact.input_zip_code,
						};
						emailObjects.push(emailObject);
					}
				}
			}
		});
		return emailObjects;
	};

	const filterEmailsFromTable = async (
		emailObjects: AttorneyEmailObject[] | EmailObject[],
		table: 'attorney_emails' | 'email_campaigns'
	) => {
		let sentEmails = [] as string[];
		// now we will loop through the email objects and check if the email has already been sent to an attorney already
		for (let i = 0; i < emailObjects.length; i += 50) {
			try {
				uiStore.toggleFunctionLoading(true);
				const { data: emails, error } = await client
					.from(table)
					.select('email')
					.in(
						'email',
						emailObjects.slice(i, i + 50).map((e) => e.email)
					);
				if (error) throw error;
				if (emails.length > 0) {
					emails.forEach((email) => {
						sentEmails.push(email.email);
					});
				}
			} catch (error) {
				console.log(error);
			} finally {
				uiStore.toggleFunctionLoading(false);
			}
		}

		// filter out the emails that have already been sent
		const filteredEmailObjects =
			sentEmails.length > 0
				? emailObjects.filter((e) => !sentEmails.includes(e.email))
				: emailObjects;

		return filteredEmailObjects;
	};

	const sendEmails = async (
		filteredEmailObjects: AttorneyEmailObject[] | EmailObject[],
		apiType: 'attorney' | 'regular' | 'probate',
		emailType:
			| 'codeViolation'
			| 'eviction'
			| 'probate'
			| 'attorney'
			| 'cashOffer'
	) => {
		let counter = 0;
		while (counter < filteredEmailObjects.length) {
			uiStore.setProgressBar({
				value: counter + 1,
				max: filteredEmailObjects.length,
				show: true,
				label: 'Sending Emails Please Wait...',
			});
			const emailObject = filteredEmailObjects[counter];
			if (!emailObject.email || emailObject.email === '') continue;
			try {
				const { data, error } = await $fetch(`/api/email/single-${apiType}`, {
					method: 'POST',
					body: { emailObject, type: emailType },
				});
				if (error) throw error;
			} catch (error) {
				console.log(error);
			} finally {
				counter++;
			}
		}
		uiStore.clearProgressBar();
	};

	const formatContacts = (
		skipType:
			| 'clearSkip_probate'
			| 'clearSkip_regular'
			| 'propstream'
			| 'attorney',
		emailType:
			| 'codeViolation'
			| 'eviction'
			| 'probate'
			| 'cashOffer'
			| 'attorney'
	) => {
		if (skipType === 'clearSkip_probate') {
			return formatClearSkipProbate(clearSkipProbateContacts.value);
		} else if (skipType === 'clearSkip_regular' && emailType !== 'attorney') {
			return formatClearSkipRegular(clearSkipRegularContacts.value, emailType);
		} else if (skipType === 'propstream') {
			// return formatPropstream(propstreamContacts.value );
		} else if (skipType === 'attorney') {
			let emailObjects = [] as AttorneyEmailObject[];
			let duplicateEmails = [] as string[];
			let formattedContacts = attorneys.value;

			formattedContacts.forEach((contact) => {
				if (!contact.attorney_email) return console.log('no email', contact);
				if (!contact.attorney_last)
					return console.log('no attorney last', contact);
				if (!contact.pr_last || !contact.pr_first)
					return console.log('no pr name', contact);
				if (duplicateEmails.includes(contact.attorney_email)) return;
				const emailObject: AttorneyEmailObject = {
					email: contact.attorney_email,
					name: contact.attorney_last,
					subject: `Important for ${contact.pr_first + ' ' + contact.pr_last}`,
					prName: contact.pr_first + ' ' + contact.pr_last,
					address1: contact.address1,
					city: contact.city,
					state: contact.state,
					zip: contact.zip,
				};
				emailObjects.push(emailObject);
				duplicateEmails.push(contact.attorney_email);
			});

			return emailObjects;
		} else {
			// return formatRegular(regularContacts.value );
		}
	};

	return {
		areContacts,
		clearSkipProbateContacts,
		propstreamContacts,
		clearSkipRegularContacts,
		attorneys,
		formatData,
		filterEmailsFromTable,
		sendEmails,
		formatContacts,
	};
};
