import { SupportedFieldsType } from "@uniport/common";
import { ObjectId } from "mongodb";


/**
 * Type of Student Profile Definition
 *
 * We have Student Profile Definition where each instance is called a Block
 * Further each Block consists of one or more fields.
 */
export type StudentProfileDefinitionModelType = {
	_id: ObjectId;
	org_id: ObjectId;
	position: number,
	is_array: Boolean
	block_name: String
	is_freezed: Boolean
	is_required: Boolean
	requires_proof: Boolean
	field_defs: FieldSchemaType[]
}


/**
 * Type of StudentProfileDefinition Field
 */
export type FieldSchemaType = {
	_id: ObjectId,
	field_name: string,
	type: SupportedFieldsType,
	// 0 means not a multi field
	// 1 means single select
	// 2 means multi select
	multi_type: 0 | 1 | 2,
	options?: string[] | number[],
	required: boolean,
	position: number
}

