import { ObjectId } from "mongodb";

/**
 * Defines the type of Invited User
 *
 * Earlier in v1 we were storing the campaign to which the user is getting invited.
 * The current version doesn't ask any campaign, as our aim here is only to get basic data and onboard an user!
 */
export type InvitedUserModelType = {
	_id: ObjectId,
	email: string,
	org_id: ObjectId,
	access_role: string,
	unique_token: string,
}

