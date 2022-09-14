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
	account_sid: string;
	api_version: string;
	body: string;
	date_created: string;
	date_sent: string;
	date_updated: string;
	direction: string;
	error_code: null;
	error_message: null;
	from: string;
	messaging_service_sid: string;
	num_media: string;
	num_segments: string;
	price: null | string;
	price_unit: null | string;
	sid: string;
	status: string;
	subresource_uris: {
		media: string;
	};
	to: string;
	uri: string;
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
