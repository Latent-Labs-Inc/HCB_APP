import { Address } from "~/types/change";
export interface InsurancePlan {
	planName: string;
	serviceTypeCodes: string[];
}

export interface BenefitsInformation {
	benefitsAdditionalInformation: {
		planNumber: "";
		drugFormularyNumber: "";
		planNetworkIdNumber: "";
	};
	benefitsDateInformation: { plan: "" };
	code: "";
	name: "";
	planCoverage: "";
	serviceTypeCodes: string[];
	serviceTypes: string[];
}

export interface PlanStatus {
	planDetails: "";
	serviceTypeCodes: string[];
	status: "";
	statusCode: "";
}

export interface Insurance {
	memberId: string;
	isValid: boolean;
	benefitsInformation?: BenefitsInformation[];
	planStatus?: PlanStatus[];
}

export interface Patient {
	firstName: string;
	lastName: string;
	dob: string;
	address?: Address;
	phone?: string;
	ssn?: string;
	gender?: string;
	user_id: string;
	patient_id: string;
	insurance: Insurance;
	created_at: Date;
	modified_at: Date;
}

export interface PatientInput {
	firstName: {
		val: string;
		isValid: boolean;
	};
	lastName: {
		val: string;
		isValid: boolean;
	};
	address1?: {
		val: string;
		isValid: boolean;
	};
	address2?: {
		val: string;
		isValid: boolean;
	};
	city?: {
		val: string;
		isValid: boolean;
	};
	state?: {
		val: string;
		isValid: boolean;
	};
	postalCode?: {
		val: string;
		isValid: boolean;
	};
	dob: {
		val: string;
		isValid: boolean;
	};
	gender?: {
		val: string;
		isValid: boolean;
	};
	phone?: {
		val: string;
		isValid: boolean;
	};
	memberId?: {
		val: string;
		isValid: boolean;
	};
	ssn?: {
		val: string;
		isValid: boolean;
	};
	insurance?: Insurance;
	dateAdded?: Date;
	user_id?: string;
	id?: string;
}

export interface Schedule {
	patients: [
		{
			patient_id: string;
			firstName: string;
			lastName: string;
		}
	];
	provider: {
		npi: string;
		firstName: string;
		lastName: string;
	};
	date: string;
	user_id: string;
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

export interface Provider {
	firstName: string;
	lastName: string;
	npi: string;
	dob: string;
	date_added: Date;
	user_id: string;
	modified_at: Date;
	practice_id: string;
}

export interface Practice {
	user_id: string;
	practiceName: string;
	address: Address;
	legalName: string;
	contactPhone: string;
	contactEmail: string;
	contactName: string;
	accountsPayableContact: string;
	accountsPayableEmail: string;
	accountsPayablePhone: string;
	clinicalContact: string;
	clinicalEmail: string;
	clinicalPhone: string;
	npi: string;
	ein: string;
	ptan: string;
	modified_at: Date;
	created_at: Date;
}

export interface ProviderInput {
	firstName: {
		val: string;
		isValid: boolean;
	};
	lastName: {
		val: string;
		isValid: boolean;
	};
	npi: {
		val: string;

		isValid: boolean;
	};
	dob: {
		val: string;
		isValid: boolean;
	};
}

export interface Delivery {
	delivery_id: string;
}

export interface Dressing {
	hcpcs: string;
	frequency?: string;
	quantity: number;
}

export interface OrderDetails {
	location: "lt" | "rt";
	bodyPart: string;
	length: number;
	width: number;
	depth: number;
	woundStage: string;
	drainage: string;
	debrided: boolean;
	icd10?: string;
	primaryDressing: Dressing;
	secondaryDressing: Dressing;
	ancillaryItems: Dressing;
	charges: number;
	provider_id: string;
}

export interface Wounds {
	1: OrderDetails;
	2?: OrderDetails;
	3?: OrderDetails;
	4?: OrderDetails;
	5?: OrderDetails;
	6?: OrderDetails;
	7?: OrderDetails;
	8?: OrderDetails;
	9?: OrderDetails;
	10?: OrderDetails;
	11?: OrderDetails;
	12?: OrderDetails;
}

export interface InsuranceShort {
	planName: string;
	benefitsInformation?: BenefitsInformation[];
	planStatus?: PlanStatus[];
}

export interface Order {
	order_id: string;
	user_id: string;
	patient_id: string;
	provider_id: string;
	orderNumber: number;
	insurance?: InsuranceShort;
	trackingNumber: string;
	status: "Ready" | "Not Ready" | "Payment Due" | "Completed" | "Held Orders";
	notes: string;
	delivery: Delivery;
	wounds: Wounds;
	created_at: Date;
	modified_at: Date;
	primaryPayment?: number;
	secondaryPayment?: number;
	active?: boolean;
}

export interface PracticeInput {
	practiceName: {
		val: "";
		isValid: boolean;
	};
	legalName: {
		val: "";
		isValid: boolean;
	};
	address1: {
		val: "";
		isValid: boolean;
	};
	address2: {
		val: "";
		isValid: boolean;
	};
	city: {
		val: "";
		isValid: boolean;
	};
	state: {
		val: "";
		isValid: boolean;
	};
	postalCode: {
		val: "";
		isValid: boolean;
	};
	contactPhone: {
		val: "";
		isValid: boolean;
	};
	contactEmail: {
		val: "";
		isValid: boolean;
	};
	contactName: {
		val: "";
		isValid: boolean;
	};
	accountsPayableContact: {
		val: "";
		isValid: boolean;
	};
	accountsPayableEmail: {
		val: "";
		isValid: boolean;
	};
	accountsPayablePhone: {
		val: "";
		isValid: boolean;
	};
	clinicalContact: {
		val: "";
		isValid: boolean;
	};
	clinicalEmail: {
		val: "";
		isValid: boolean;
	};
	clinicalPhone: {
		val: "";
		isValid: boolean;
	};
	groupNpi: {
		val: "";
		isValid: boolean;
	};
	ein: {
		val: "";
		isValid: boolean;
	};
	ptan: {
		val: "";
		isValid: boolean;
	};
}

export interface FormElement {
	id: string;
	title: string;
	required: boolean;
	error?: string;
	placeholder?: string;
}

export interface SalesRep {
	user_id: string;
	firstName: string;
	lastName: string;
	businessName: string;
	email: string;
	phone: string;
	children: string[] | null;
	practices: string[] | null;
	created_at: Date;
	modified_at: Date;
	parent_id: string | null;
}

export interface Profile {
	user_id: string;
	type: "salesRep" | "practice" | "admin";
	email: string;
	username: string;
	admin: boolean;
	rep_id: string;
	practice_id: string;
	created_at: Date;
	modified_at: Date;
}
