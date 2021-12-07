import { ObjectId } from "mongodb";


/**
 * Defines the type of Field Value
 */
export type StudentProfileFieldValueType = number | number[] | string | string[];


/**
 * Defines the type of Field Data
 */
export type StudentProfileFieldData = {
	_id: ObjectId,
	value: StudentProfileFieldValueType,
}


/**
 * Defines the type of Verification Info
 *
 * VerificationInfo will be per block basis (not field basis)
 * Any update by user (including admin) shall set the VerificationInfo block to null
 */
export type StudentProfileVerificationInfoType = {
	_id: ObjectId,
	timestamp: Date,
	verified_uid: ObjectId,
	verifier_name: string
}

/**
 * Defines the type of Block Data
 *
 * We are having _id as there will be some student profile definitions where multiple instances are allowed. Like projects etc
 */
export type StudentProfileBlockDataType = {
	_id: ObjectId,
	block_def_id: ObjectId,
	field_data: StudentProfileFieldData[]
	verification_info: StudentProfileVerificationInfoType | null
}


/**
 * Defines the type of Student Profile
 *
 * Note that we have duplicated first_name, last_name, email_address from User Model
 * A Student can be enrolled to many Campaigns (One to Many)
 * Similarly, there is a Many to Many relation from Campaign to Student. (But we aren't storing it anywhere! as this relation isn't critical for our application)
 *
 */
export type StudentProfileModelType = {
	_id: ObjectId,
	campaigns: { _id: ObjectId, campaign_name: string }[],
	first_name: string,
	last_name: string,
	email_address: string,
	org_id: ObjectId,
	blocks_data: StudentProfileBlockDataType[],
}

