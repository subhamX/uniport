import { ObjectId } from "mongodb";
import { FieldSchemaType } from "./StudentProfileDefinition";
import { FilteringRuleGroup } from "./StudentProfileFilters";

export type JobProfileModelType = {
	_id: ObjectId,
	company_id: ObjectId,
	camp_id: ObjectId,
	org_id: ObjectId,
	title: string,
	stipend_low: number,
	stipend_high: number,
	description: string,
	deadline: Date,
	creator_uid: ObjectId,
	creator_name: string,
	created_at: Date
	rule_groups: FilteringRuleGroup[],
	additional_questions: FieldSchemaType[]
	is_complete: boolean,
	current_stage: number,
	stages: JobProfileStageType[],
	array_blocks_config: JobProfileArrayBlockConfig[],
	is_published: boolean
}


export type JobProfileStageType = {
	_id: ObjectId,
	stage_name: string,
	icon_url: string,
}

export type JobProfileArrayBlockConfig = {
	_id: ObjectId,
	min_blocks: number,
	max_blocks: number,
	help_text: string,
}
