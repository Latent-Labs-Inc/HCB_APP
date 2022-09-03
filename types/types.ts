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
	postalCode: string;
	countryCode?: string;
	locationIdentifier?: string;
	countrySubDivisionCode?: string;
}
export interface Contact {
	contact_id: string;
	propertyAddress: Address;
	sqFt: number;
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
	isForeclosure?: boolean;
	isHomestead?: boolean;
	isSenior?: boolean;
	isVacant?: boolean;
	alternateContacts?: string;
	created_at: Date;
	modified_at: Date;
}
