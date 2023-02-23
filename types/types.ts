import { Database } from './supabase';

export interface FormElement {
	id: string;
	title: string;
	required: boolean;
	error?: string;
	placeholder?: string;
}

export interface Profile {
	user_id: string;
	type: 'salesRep' | 'practice' | 'admin';
	email: string;
	username: string;
	admin: boolean;
	phoneNumbers: string[];
	created_at: Date;
	modified_at: Date;
}

export interface ActionIcon {
	name: string;
	render: () => {};
}
export interface ActionProps {
	id: string;
	name: string;
	icon: ActionIcon;
}

export interface Address {
	address1: string;
	address2?: string;
	city: string;
	state: string;
	zip: string;
	county?: string;
	countryCode?: string;
	locationIdentifier?: string;
	countrySubDivisionCode?: string;
}
export type Lead = Database['public']['Tables']['leads']['Row'];

export interface IncomingMessage {
	user_id: string;
	message: string;
	from: string;
	to: string;
	sid: string;
	created_at: string;
	sent_at: string;
	updated_at: string;
	status: string;
	direction: string;
	errorCode: string;
	errorMessage: string;
	lead_id: string;
	propertyAddress: Address;
}

export interface TwilioIncoming {
	MessageSid: string;
	AccountSid: string;
	MessagingServiceSid: string;
	From: string;
	To: string;
	Body: string;
	NumMedia: string;
	NumSegments: string;
	ReferralNumMedia?: string;
	FromCity: string;
	FromState: string;
	FromZip: string;
	FromCountry: string;
	ToCity: string;
	ToState: string;
	ToZip: string;
	ToCountry: string;
	MessageStatus: string;
}

export interface Filter {
	field: string;
	operator: string;
	value: string | number | boolean;
}

export type SentMessage = Database['public']['Tables']['sent_messages']['Row'];

export interface Message {
	user_id: string;
	message: string;
	from: string;
	to: string;
	sid: string;
	created_at: Date;
	sent_at: Date;
	updated_at: Date;
	status: string;
	direction: string;
	errorCode: number;
	errorMessage: string;
	lead_id: string;
	propertyAddress: Address;
}

export interface TwilioCSV {
	From: string;
	To: string;
	Body: string;
	Status: string;
	SentDate: string;
	ApiVersion: string;
	NumSegments: string;
	ErrorCode: string;
	AccountSid: string;
	Sid: string;
	Direction: string;
	Price: string;
	PriceUnit: string;
}

export interface Template {
	name: string;
	template_id: string;
	message: string;
	created_at: Date;
	modified_at: Date;
	user_id: string;
}
export interface Item {
	id: string;
	label: string;
}

export interface TwilioResponse {
	body: string;
	numSegments: string;
	direction: string;
	from: string;
	to: string;
	dateUpdated: Date;
	price: null | string;
	errorMessage: null | string;
	uri: string;
	accountSid: string;
	numMedia: string;
	status: string;
	messagingServiceSid: null | string;
	sid: string;
	dateSent: Date;
	dateCreated: Date;
	errorCode: number;
	priceUnit: string;
	apiVersion: string;
	subresourceUris: {};
}

export interface FD_Probate {
	'File Date': string;
	'Attorney Address': string;
	'Attorney Bar No': string;
	'Attorney City': string;
	'Attorney Email ID': string;
	'Attorney First Name': string;
	'Attorney Last Name': string;
	'Attorney Middle Name': string;
	'Attorney Ph Number': string;
	'Attorney State': string;
	'Attorney Zip': string;
	'First Name (Deceased)': string;
	'Last Name': string;
	'Middle Name': string;
	'PR Address': string;
	'PR City': string;
	'PR First Name': string;
	'PR Last Name': string;
	'PR Middle Name': string;
	'PR Ph Number': string;
	'PR State': string;
	'PR Zip': string;
	'Property Address': string;
	'Property City': string;
	'Property State': string;
	'Property Zip': string;
}

export interface FormattedProbates {
	user_id: string;
	id: string;
	filing_date: string;
	deceased_first: string;
	deceased_last: string;
	address1: string;
	city: string;
	state: string;
	zip: string;
	pr_first: string;
	pr_last: string;
	pr_address1: string;
	pr_city: string;
	pr_state: string;
	pr_zip: string;
	pr_phone: string;
	attorney_first: string;
	attorney_last: string;
	attorney_address1: string;
	attorney_city: string;
	attorney_state: string;
	attorney_zip: string;
	attorney_phone: string;
	attorney_email: string;
	created_at: Date;
	modified_at: Date;
}

export interface PropSkipTrace {
	cell: string;
	cell_2: string;
	cell_3: string;
	cell_4: string;
	city: string;
	company_name: string;
	dnc: string;
	dnc_2: string;
	dnc_3: string;
	dnc_4: string;
	email_1: string;
	email_2: string;
	email_3: string;
	email_4: string;
	first_name: string;
	landline: string;
	landline_2: string;
	landline_3: string;
	landline_4: string;
	last_name: string;
	mail_address_same: string;
	mail_city: string;
	mail_state: string;
	mail_street_address: string;
	mail_zip: string;
	phone: string;
	state: string;
	status: string;
	street_address: string;
	type: string;
	zip: string;
}

export interface ClearSkipProbate {
	input_address_1: string;
	input_city: string;
	input_extra_1: string;
	input_extra_2: string;
	input_extra_3: string;
	input_extra_4: string;
	input_first_name: string;
	input_last_name: string;
	input_other_1: string;
	input_other_2: string;
	input_other_3: string;
	input_other_4: string;
	input_other_5: string;
	input_other_6: string;
	input_other_7: string;
	input_other_8: string;
	input_other_9: string;
	input_state: string;
	input_zip_code: string;
	rel1_address: string;
	rel1_age: string;
	rel1_city: string;
	rel1_email_1: string;
	rel1_email_2: string;
	rel1_email_3: string;
	rel1_first_name: string;
	rel1_full_name: string;
	rel1_last_name: string;
	rel1_likely_relationship: string;
	rel1_middle_name: string;
	rel1_phone_1: string;
	rel1_phone_2: string;
	rel1_phone_3: string;
	rel1_state: string;
	rel1_suffix: string;
	rel1_zip: string;
	rel2_address: string;
	rel2_age: string;
	rel2_city: string;
	rel2_email_1: string;
	rel2_email_2: string;
	rel2_email_3: string;
	rel2_first_name: string;
	rel2_full_name: string;
	rel2_last_name: string;
	rel2_likely_relationship: string;
	rel2_middle_name: string;
	rel2_phone_1: string;
	rel2_phone_2: string;
	rel2_phone_3: string;
	rel2_state: string;
	rel2_suffix: string;
	rel2_zip: string;
	rel3_address: string;
	rel3_age: string;
	rel3_city: string;
	rel3_email_1: string;
	rel3_email_2: string;
	rel3_email_3: string;
	rel3_first_name: string;
	rel3_full_name: string;
	rel3_last_name: string;
	rel3_likely_relationship: string;
	rel3_middle_name: string;
	rel3_phone_1: string;
	rel3_phone_2: string;
	rel3_phone_3: string;
	rel3_state: string;
	rel3_suffix: string;
	rel3_zip: string;
	rel4_address: string;
	rel4_age: string;
	rel4_city: string;
	rel4_email_1: string;
	rel4_email_2: string;
	rel4_email_3: string;
	rel4_first_name: string;
	rel4_full_name: string;
	rel4_last_name: string;
	rel4_likely_relationship: string;
	rel4_middle_name: string;
	rel4_phone_1: string;
	rel4_phone_2: string;
	rel4_phone_3: string;
	rel4_state: string;
	rel4_suffix: string;
	rel4_zip: string;
	rel5_address: string;
	rel5_age: string;
	rel5_city: string;
	rel5_email_1: string;
	rel5_email_2: string;
	rel5_email_3: string;
	rel5_first_name: string;
	rel5_full_name: string;
	rel5_last_name: string;
	rel5_likely_relationship: string;
	rel5_middle_name: string;
	rel5_phone_1: string;
	rel5_phone_2: string;
	rel5_phone_3: string;
	rel5_state: string;
	rel5_suffix: string;
	rel5_zip: string;
	'rel_hit_(y/n/u)': string;
}

export interface ClearSkipRegular {
	add_address1: string;
	add_address1_city: string;
	add_address1_last_seen: string;
	add_address1_state: string;
	add_address1_zip: string;
	'add_hit_(y/n)': string;
	address: string;
	city: string;
	email_email1: string;
	email_email1_first_seen: string;
	email_email1_last_seen: string;
	email_email2: string;
	email_email2_first_seen: string;
	email_email2_last_seen: string;
	email_email3: string;
	email_email3_first_seen: string;
	email_email3_last_seen: string;
	email_email4: string;
	email_email4_first_seen: string;
	email_email4_last_seen: string;
	email_email5: string;
	email_email5_first_seen: string;
	email_email5_last_seen: string;
	email_email6: string;
	email_email6_first_seen: string;
	email_email6_last_seen: string;
	email_email7: string;
	email_email7_first_seen: string;
	email_email7_last_seen: string;
	email_email8: string;
	email_email8_first_seen: string;
	email_email8_last_seen: string;
	email_email9: string;
	email_email9_first_seen: string;
	email_email9_last_seen: string;
	email_email10: string;
	email_email10_first_seen: string;
	email_email10_last_seen: string;
	input_address_1: string;
	input_city: string;
	input_extra_1: string;
	input_extra_2: string;
	input_extra_3: string;
	input_extra_4: string;
	input_first_name: string;
	input_last_name: string;
	input_state: string;
	input_zip_code: string;
	ph_phone1: string;
	ph_phone1_last_seen: string;
	ph_phone1_type: string;
	ph_phone2: string;
	ph_phone2_last_seen: string;
	ph_phone2_type: string;
	ph_phone3: string;
	ph_phone3_last_seen: string;
	ph_phone3_type: string;
	ph_phone4: string;
	ph_phone4_last_seen: string;
	ph_phone4_type: string;
	ph_phone5: string;
	ph_phone5_last_seen: string;
	ph_phone5_type: string;
	ph_phone6: string;
	ph_phone6_last_seen: string;
	ph_phone6_type: string;
	ph_phone7: string;
	ph_phone7_last_seen: string;
	ph_phone7_type: string;
	ph_phone8: string;
	ph_phone8_last_seen: string;
	ph_phone8_type: string;
	ph_phone9: string;
	ph_phone9_last_seen: string;
	ph_phone9_type: string;
	ph_phone10: string;
	ph_phone10_last_seen: string;
	ph_phone10_type: string;
	'ph_phone_(y/n/u)': string;
	pr_first_name: string;
	pr_last_name: string;
	pr_middle_name: string;
	pr_ph_number: string;
	state: string;
	zip: string;
}

export interface AttorneyEmailObject {
	email: string;
	subject: string;
	name: string;
	prName: string;
	address1: string;
	city: string;
	state: string;
	zip: string;
}
export interface EmailObject {
	email: string;
	subject: string;
	name: string;
	address1: string;
	city: string;
	state: string;
	zip: string;
}

export type Property = Database['public']['Tables']['flip_list']['Row'];
