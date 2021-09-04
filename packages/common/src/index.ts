import { SupportedFormFieldTypes } from './forms/student_profile/index';


export * from './forms/AdminOnboard';
export * from './forms/RegisterWithInvite';
export * from './forms/student_profile/AddressTypeA';
export * from './forms/student_profile/index';

export * from './mockdata'

// ! Every file in forms define the validation pattern and the type


export type OrgSchemaInstanceBlock = {
	attributeType: SupportedFormFieldTypes,
	isArray?: Boolean, // defines if we shall take an array
	// [key: string]: any
	"label": string,
	"isBlocked": boolean,
	"required": boolean,
	"options"?: string[] // notice that we only support strings as options
	"requiresProof": boolean,
}

export type verificationInfo = {
	isVerfied: boolean,
	verifyActionTimestamp: Date,
	verifiedBy: string
}


export * from './types/graphql'
