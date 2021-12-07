import { ObjectId } from "mongodb";


/**
 * Defines type of User Model
 *
 * There is One to One relation between User and Org
 */
export type UserModelType = {
	_id: ObjectId,
	first_name: string,
	last_name: string,
	email_address: string,
	hashed_password: string,
	org_id: ObjectId,
	access_role: string,
}

