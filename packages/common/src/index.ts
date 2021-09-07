import { SupportedLEGOsTypes } from './forms/student_profile/index';


export * from './forms/AdminOnboard';
export * from './forms/RegisterWithInvite';
export * from './forms/student_profile/AddressTypeA';
export * from './forms/student_profile/index';

export * from './mockdata'

// ! Every file in forms define the validation pattern and the type


export type OrgSchemaInstanceBlock = {
	attribute_type: SupportedLEGOsTypes,
	is_array?: Boolean, // defines if we shall take an array
	// [key: string]: any
	label: string,
	is_blocked: boolean,
	required: boolean,
	options?: string[] // notice that we only support strings as options
	requires_proof: boolean,
}

export type verificationInfo = {
	isVerfied: boolean,
	verifyActionTimestamp: Date,
	verifiedBy: string
}


export * from './types/graphql'


export * from './legos/DataValidators';
