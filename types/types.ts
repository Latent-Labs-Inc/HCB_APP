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
	sqFt: string;
	yearBuilt: string;
	ownerFirstName: string;
	ownerLastName: string;
	ownerAddress: Address;
	wireless: string[];
	landline: string[];
	email: string[];
	lastSaleDate: Date;
	lastSalePrice: number;
	estimatedValue: number;
	foreclosure?: boolean;
	homestead?: boolean;
	senior?: boolean;
	vacant?: boolean;
	alternateContacts?: string;
	created_at: Date;
	modified_at: Date;
}

export interface IncomingMessage {
	body: string;
	from: string;
	to: string;
	sid: string;
	created_at: string;
	sent_at: string;
	updated_at: string;
	status: string;
	direction: string;
	error_code: string;
	error_message: string;
	lead_id: string;
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
