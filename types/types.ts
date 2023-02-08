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
