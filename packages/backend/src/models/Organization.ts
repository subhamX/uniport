import { ObjectId } from "mongodb";


/**
 * Defines the type of Organization Model
 */
export type OrganizationModelType = {
	_id: ObjectId,
	name: string,
	logo: string,
	number_of_invited_users: number,
	number_of_joined_users: number,
	number_of_joined_students: number,
}
