import { gql } from "apollo-server-core";



export const studentProfileFilters= gql`
	input FilteringConditionInput {
		# key: String!
		# lego_type: FieldsTypeEnum! # just an additional input we are taking from user for debug, and ensure correctness
		block_def_id: String!
		field_id: String!
		# using generic JSON encoding
		compare_value: FieldValueScalar
		operator: SupportedFilteringOperator!
	}

	enum SupportedFilteringOperator {
		# base
		EQUALS
		DOES_NOT_EQUAL

		# text/email/markdown based
		STARTS_WITH
		ENDS_WITH
		CONTAINS
		DOES_NOT_CONTAIN

		# int/number
		GREATER_THAN
		LESS_THAN
		GREATER_THAN_OR_EQUAL
		LESS_THAN_OR_EQUAL
		IS_BETWEEN # inclusive

		# date
		# dates must be sent in ISO format (as strings)
		DATE_IS_BEFORE
		DATE_IS_AFTER
		DATE_IS_BETWEEN # inclusive

		# for array (base doesn't work for arrays)
		CONTAINS_ALL_OF
		CONTAINS_ANY_OF
		CONTAINS_NONE_OF
	}

	input FilteringConditionGroup{
		conditions: [FilteringConditionInput!]!
	}

`
