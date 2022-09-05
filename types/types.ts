import { S } from "unimport/dist/types-0260c723";

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
