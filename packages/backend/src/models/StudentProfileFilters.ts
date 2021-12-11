import { SupportedFilteringOperator } from "@uniport/common";
import { ObjectId } from "mongodb";
import { StudentProfileFieldValueType } from './StudentProfile'

export type FilteringCondition = {
	block_def_id: ObjectId;
	field_id: ObjectId;
	compare_value: StudentProfileFieldValueType,
	operator: SupportedFilteringOperator
}

export type FilteringRuleGroup = {
	_id: ObjectId;
	conditions: FilteringCondition[]
}
