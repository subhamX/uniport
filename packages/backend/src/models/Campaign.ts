import { ObjectId } from "mongodb";

/**
 * Defines the model type of campaign
 * There is a One to One relation from Campaign to Organization
 * Also, there is a One to Many relation from Organization to Campaign
 */
export type CampaignModelType = {
	_id: ObjectId,
	org_id: ObjectId,
	campaign_name: string,
	number_of_students: number,
	number_of_placed_students: number,
	number_of_job_profiles: number
	number_of_offers: number
	// TODO: Campaign Rules
	rules: []
}

