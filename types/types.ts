export interface FormElement {
	id: string;
	title: string;
	required: boolean;
	error?: string;
	placeholder?: string;
}

export interface Profile {
	user_id: string;
	type: "salesRep" | "practice" | "admin";
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
export interface Lead {
	user_id: string;
	lead_id: string;
	leadType: string;
	leadProvider: string;
	propertyAddress: Address;
	ownerFirstName: string;
	ownerLastName: string;
	wireless: string[];
	landline: string[];
	email: string[];
	created_at: Date;
	modified_at: Date;
	texted: boolean;
	emailed: boolean;
	mailed: boolean;
	fileDate: Date;
	prFirstName?: string;
	prLastName?: string;
	prAddress?: Address;
	mailingAddress?: Address;
	legalDescription?: string;
	favorite?: boolean;
	favoritePhone?: string;
}

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
