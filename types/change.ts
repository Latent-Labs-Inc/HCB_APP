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

export interface ChangeToken {
	access_token: string;
	token_type: string;
	expires_in: number;
}

export interface Provider {
	organizationName: string;
	firstName?: string;
	lastName?: string;
	npi: string;
	serviceProviderNumber?: string;
	payorId?: string;
	taxId?: string;
	ssn?: string;
	pharmacyProcessorNumber?: string;
	servicesPlanID?: string;
	employersId?: string;
	providerCode?: string;
	referenceIdentification?: string;
	providerType?: string;
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

export interface InformationReceiverName {
	stateLicenceNumber: string;
	medicareProviderNumber: string;
	medicaidProviderNumber: string;
	facilityIdNumber: string;
	contactNumber: string;
	devicePinNumber: string;
	submitterIdNumber: string;
	nationalProviderIdentifier: string;
	providerPlanNetworkIdNumber: string;
	facilityNetworkIdNumber: string;
	priorIdentifierNumber: string;
	socialSecurityNumber: string;
	federalTaxpayerIdentificationNumber: string;
	informationReceiverAdditionalIdentifierState: string;
	address: Address;
}

export interface Subscriber {
	birthSequenceNumber?: string;
	caseNumber?: string;
	medicaidRecipientIdentificationNumber?: string;
	spendDownAmount?: string;
	spendDownTotalBilledAmount?: string;
	coverageLevelCode?: string;
	memberId: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	suffix?: string;
	gender: string;
	dateOfBirth: string;
	ssn?: string;
	groupNumber?: string;
	idCard?: string;
	providerCode?: string;
	referenceIdentificationQualifier?: string;
	providerIdentifier?: string;
	beginningCardIssueDate?: string;
	endCardIssueDate?: string;
	idCardIssueDate?: string;
	planIssueDate?: string;
	beginningPlanIssueDate?: string;
	endPlanIssueDate?: string;
	healthCareCodeInformation?: [
		{ diagnosisTypeCode: string; diagnosisCode: string }
	];
	address?: Address;
	additionalIdentification?: {
		planNumber: string;
		policyNumber: string;
		memberIdentificationNumber: string;
		contractNumber: string;
		medicalRecordIdentificationNumber: string;
		patientAccountNumber: string;
		identificationCardSerialNumber: string;
		healthInsuranceClaimNumber: string;
		insurancePolicyNumber: string;
		planNetworkIdentificationNumber: string;
		agencyClaimNumber: string;
	};
}
export interface Dependent {
	birthSequenceNumber?: string;
	individualRelationshipCode?: string;
	issueNumber?: string;
	eligibilityCategory?: string;
	memberId?: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	suffix?: string;
	gender: string;
	dateOfBirth: string;
	ssn?: string;
	groupNumber: string;
	idCard?: string;
	providerCode?: string;
	referenceIdentificationQualifier?: string;
	providerIdentifier?: string;
	beginningCardIssueDate?: string;
	endCardIssueDate?: string;
	idCardIssueDate?: string;
	planIssueDate?: string;
	beginningPlanIssueDate?: string;
	endPlanIssueDate?: string;
	healthCareCodeInformation?: [
		{ diagnosisTypeCode: string; diagnosisCode: string }
	];
	address?: Address;
	additionalIdentification?: {
		planNumber: string;
		policyNumber: string;
		memberIdentificationNumber: string;
		contractNumber: string;
		medicalRecordIdentificationNumber: string;
		patientAccountNumber: string;
		healthInsuranceClaimNumber: string;
		identificationCardSerialNumber: string;
		insurancePolicyNumber: string;
		planNetworkIdentificationNumber: string;
		agencyClaimNumber: string;
	};
}

export interface Encounter {
	beginningDateOfService: string;
	endDateOfService: string;
	dateOfService?: string;
	serviceTypeCodes: string[];
	priorAuthorizationOrReferralNumber?: string;
	referenceIdentificationQualifier?: string;
	industryCode?: string;
	productOrServiceIDQualifier?: string;
	procedureCode?: string;
	procedureModifiers?: string[];
	diagnosisCodePointer?: string[];
	medicalProcedures?: [
		{
			productOrServiceIDQualifier: string;
			procedureCode: string;
			procedureModifiers: string[];
			diagnosisCodePointer: string[];
		}
	];
}
export interface ChangeEligibility {
	submitterTransactionIdentifier?: string;
	controlNumber: string;
	tradingPartnerServiceId: string;
	tradingPartnerName?: string;
	provider: Provider;
	portalUsername?: string;
	portalPassword?: string;
	informationReceiverName?: InformationReceiverName;
	subscriber: Subscriber;
	dependents?: Dependent[];
	encounter: Encounter;
}

export interface Payer {
	entityIdentifier: string;
	entityType: "Non-Person Entity" | "Individual";
	name: string;
	payorIdentification: string;
}
export interface SubscriberTraceNumber {
	originatingCompanyIdentifier: string;
	referenceIdentification: string;
	traceType: string;
	traceTypeCode: string;
}
export interface EligibilityResponse {
	benefitsInformation: BenefitsInformation[];
	controlNumber: string;
	meta: { senderId: string; applicationMode: string; traceId: string };
	payer: Payer;
	planDateInformation: { plan: string };
	planInformation: { policyNumber: string };
	planStatus: PlanStatus[];
	provider: Provider;
	reassociationKey: "";
	subscriber: Subscriber;
	subscriberTraceNumbers: SubscriberTraceNumber[];
	tradingPartnerServiceId: string;
}
export interface ProfessionalService {
	procedureIdentifier: "";
	lineItemChargeAmount: "";
	procedureCode: "";
	measurementUnit: "";
	serviceUnitCount: "";
	compositeDiagnosisCodePointers: {
		diagnosisCodePointers: string[];
	};
}
export interface ServiceLine {
	serviceDate: "";
	professionalService: ProfessionalService;
}

export interface HealthCareCodeInformation {
	diagnosisTypeCode: "";
	diagnosisCode: "";
}

export interface ClaimInformation {
	claimFilingCode: "";
	patientControlNumber: "";
	claimChargeAmount: "";
	placeOfServiceCode: "";
	claimFrequencyCode: "";
	signatureIndicator: "";
	planParticipationCode: "";
	benefitsAssignmentCertificationIndicator: "";
	releaseInformationCode: "";
	claimSupplementalInformation: {
		repricedClaimNumber: "";
		claimNumber: "";
	};
	healthCareCodeInformation: HealthCareCodeInformation[];
	serviceFacilityLocation: {
		organizationName: "";
		address: Address;
	};
	serviceLines: ServiceLine[];
}
