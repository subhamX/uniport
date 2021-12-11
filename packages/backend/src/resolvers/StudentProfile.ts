import { ForbiddenError, UserInputError } from "apollo-server-core";
import { authenticatedUsersOnly } from "../config/auth/authCheckers";
import { dbClient } from "../db";
import { CustomApolloContext } from "../types/CustomApolloContext";
import { GetStudentProfileByQueryInput, MutateStudentProfileBlockDataInput } from '@uniport/common'
import { ObjectId } from "mongodb";
import { FieldSchemaType, StudentProfileDefinitionModelType } from "../models/StudentProfileDefinition";
import * as Yup from 'yup'
import { StudentProfileBlockDataType, StudentProfileFieldValueType } from "../models/StudentProfile";
import { isFieldValueValid } from "../utils/isFieldValueValid";

export const studentProfileResolvers = {
	Query: {
		/**
		 * Method to query all the student records in the organization and send the filtered results
		 * Only authenticated users with ADMIN scope can perform this operation
		 *
		 * ! We aren't performing any validation, as it makes the filtering process very slow. It's the client duty to pass things rightly. Failing to do it will cause EMPTY results!
		 * UPDATE: We do have a validation module in JobProfile which can be used to validate the fields
		 * Do note that all inputs are thoroughly analysed before executing.
		 *
		 * Note: for block with is_array=true; we don't allow filtering, but still if someone gives block_def_id and field_id, we shall go ahead and execute the query
		 * TODO: Although, for now we didn't find any case which causes any issues. See if there is anything which mandates us to perform full validation for security reason!
		 */
		getStudentProfileByQuery: async (_: any, { payload }: { payload: GetStudentProfileByQueryInput }, ctx: CustomApolloContext) => {
			authenticatedUsersOnly(ctx.req);
			// user needs to be an admin
			if (ctx.req.user?.access_role !== 'ADMIN') {
				throw new ForbiddenError("Only admin can perform this action accessing all students data");
			}

			if (!payload.page_size) throw new UserInputError('PageSize must be positive')

			const limit = payload.page_size > 25 ? 25 : payload.page_size;
			const filterGroups: any[][] = [];

			for (const groupId in payload.filter_groups) {
				const group = payload.filter_groups[groupId]
				const stages: any[] = [];
				for (const condition of group.conditions) {
					// block_id -> student_def_block
					// field_id -> individual field inside it
					// TODO: When IS_EMPTY, IS_NOT_EMPTY is added
					if (((condition as any).operator === 'IS_EMPTY' || (condition as any).operator === 'IS_NOT_EMPTY')) {
						if (condition.compare_value !== undefined) throw new UserInputError(`Operator: ${condition.operator} doesn't require CompareValue`)
					} else {
						if (!condition.compare_value) throw new UserInputError(`Operator: ${condition.operator} require CompareValue`)
					}

					const query = generateCompareValue(condition.operator, condition.compare_value);

					if (condition.block_def_id === 'first_name' ||
						condition.block_def_id === 'email_address' ||
						condition.block_def_id === 'last_name') {
						if (condition.block_def_id !== condition.field_id) throw new UserInputError(`block_def_id and field_id should be equal for ${condition.block_def_id}`);
						stages.push({
							[condition.block_def_id]: query,
						})
					} else {
						const blockDefId = new ObjectId(condition.block_def_id);
						const fieldId = new ObjectId(condition.field_id);

						stages.push({
							"blocks_data.block_def_id": blockDefId,
							"blocks_data.field_data": {
								"$elemMatch": {
									"_id": fieldId,
									"value": query
								}
							}
						})
					}
				}
				filterGroups.push(stages);
			}
			const facetObject: any = {}
			filterGroups.forEach((group, indx) => {
				facetObject[`GROUP_${indx}`] = [
					{ $match: { $and: group } },
					{ $addFields: { matched_group: indx } }
				]
			})

			const cursor = dbClient.collection('student_profile').aggregate([
				{
					$match: {
						$or: filterGroups.map(group => ({ $and: group }))
					}
				},
				{
					$facet: facetObject
				},
				{
					$project: {
						result: {
							$concatArrays: filterGroups.map((_, indx) => `$GROUP_${indx}`)
						}
					}
				},
				{ $unwind: "$result" },
				{
					$replaceRoot: { newRoot: "$result" }
				},
				{
					$group: {
						_id: "$_id",
						first_name: { $first: "$first_name" },
						blocks_data: { $first: "$blocks_data" },
						email_address: { $first: "$email_address" },
						last_name: { $first: "$last_name" },
						campaigns: { $first: "$campaigns" },
						org_id: { $first: "$org_id" },
						"matched_groups": { "$addToSet": "$matched_group" }
					}
				},
				// sort
				{ $sort: { first_name: 1, last_name: 1, _id: 1, } },
				// offset
				{ $skip: payload.offset },
				// limit
				{ $limit: limit }
			]);
			const results = await cursor.toArray();

			return results;
		},
		/**
		 * Method to get the whole student profile data by Id
		 *
		 * Only authenticated users with ADMIN scope or STUDENT themselves can access the record
		 */
		getStudentProfileById: async (_: any, { _id }: { _id: string }, ctx: CustomApolloContext) => {
			authenticatedUsersOnly(ctx.req);

			const askedUserId = new ObjectId(_id);
			if (_id !== ctx.req.user?._id.toString() && ctx.req.user?.access_role !== 'ADMIN') {
				throw new ForbiddenError("Only ADMIN or the student themselves can access view this record!");
			}

			const doc = await dbClient.collection('student_profile').findOne({
				_id: askedUserId,
				// using org_id to ensure isolation between orgs
				org_id: new ObjectId(ctx.req.user.org_id)
			})

			return doc;
		}
	},
	Mutation: {
		/**
		 * Method to add/edit a student profile block
		 *
		 * Only authenticated users with ADMIN scope or STUDENT themselves can perform this action
		 * The user should send data corresponding to the whole block (which contains multiple fields).
		 * If the block is_freezed then only ADMIN can perform this operation. (Student cannot do it)
		 */
		mutateStudentProfileBlockData: async (_: any, { payload }: { payload: MutateStudentProfileBlockDataInput }, ctx: CustomApolloContext) => {
			authenticatedUsersOnly(ctx.req);

			const userId = new ObjectId(payload.user_id);
			const orgId = new ObjectId(ctx.req.user?.org_id);

			if (payload.user_id !== ctx.req.user?._id.toString() && ctx.req.user?.access_role !== 'ADMIN') {
				throw new ForbiddenError("Only ADMIN or the student themselves can access add/edit a block in this record!");
			}

			if (!payload.fields.length) {
				throw new UserInputError("fields array cannot be empty. It should contain exactly the number of fields the block definition contain")
			}

			const numberOfFields = payload.fields.length;

			const isEditMode = (payload._id) ? true : false;
			const blockDefId = new ObjectId(payload.block_def_id);
			const blockDataId = payload._id ? new ObjectId(payload._id) : new ObjectId();

			for (let i = 0; i < numberOfFields; i++) {
				for (let j = i + 1; j < numberOfFields; j++) {
					const e = payload.fields[i];
					const f = payload.fields[j];
					if (f._id === e._id) {
						throw new UserInputError(`Same field_id ${e._id} cannot be referred more than once.`)
					}
				}
			}

			// check that there exists a student def
			const doc = (await dbClient.collection('student_profile_definition').findOne({
				_id: blockDefId,
				org_id: orgId,
			}, {
				projection: {
					"is_array": 1,
					"field_defs": 1
				}
			})) as StudentProfileDefinitionModelType;

			if (!doc) {
				throw new ForbiddenError("Invalid access");
			}

			if (doc.is_freezed && ctx.req.user.access_role === 'STUDENT') {
				throw new ForbiddenError("The field is freezed and cannot be modified. Contact ADMIN for more support!");
			}

			const fieldDefs = doc.field_defs as unknown as FieldSchemaType[];

			const studentData = await dbClient.collection('student_profile').find({
				_id: userId,
				"blocks_data.block_def_id": blockDefId,
			}, {
				projection: {
					"blocks_data.$": 1
				}
			}).limit(1).count();
			// limiting 1 as I know at max there can be only 1 student record

			if (studentData && !isEditMode && !doc.is_array) {
				throw new UserInputError("The definition doesn't allow multiple block! You can add only one!")
			}

			const newFields = []
			const handle = dbClient.collection('student_profile').initializeUnorderedBulkOp();

			// for all field definitions of the specified block
			for (let fieldDefinition of fieldDefs) {
				const fieldInstance = payload.fields.find(e => e._id === fieldDefinition._id.toString());
				if (!fieldInstance) {
					throw new UserInputError(`There is no data provided for fieldId: ${fieldDefinition._id} named: ${fieldDefinition.field_name}`);
				}
				// validate if given value by user is at par with the expected value defined in block definition
				isFieldValueValid(fieldDefinition, fieldInstance.value)

				const _id = new ObjectId(fieldDefinition._id);
				const newField = {
					_id,
					value: fieldInstance.value
				}

				newFields.push(newField);
			}

			const blockData: StudentProfileBlockDataType = {
				_id: blockDataId,
				block_def_id: blockDefId,
				field_data: newFields,
				verification_info: null
			}

			if (!isEditMode) {
				handle.find({
					_id: userId,
					org_id: orgId,
				}).updateOne({
					$push: {
						blocks_data: blockData
					}
				})
			} else {
				// block_def_id array already exists
				handle.find({
					_id: userId,
					org_id: orgId,
					"blocks_data._id": blockDataId,
				}).updateOne({
					$set: {
						"blocks_data.$": blockData
					}
				})
			}
			const res = await handle.execute();

			// Note that it might happen that the user gave an _id (of blockData, and not of blockDef) which is invalid
			// For isEditMode==false, the following shall never fail!
			if (!res.nMatched) {
				throw new UserInputError(`Invalid _id: ${blockDataId} passed. There seem to be no data block to edit.`)
			}



			return {
				_id: blockDataId,
				block_def_id: blockDefId,
				field_data: newFields
			};
		}
	}
}


/**
 * Generate the query with MongoDB aggregation operator for the given operator and compare_value
 *
 * It throws error if there are any type mismatch or any errors!
 * @param operator
 * @param compare_value
 * @returns mongodb aggregation query operator
 */
const generateCompareValue = (operator: string, compare_value: StudentProfileFieldValueType) => {
	let valueMatchObj = {};

	if (operator === 'EQUALS') {
		valueMatchObj = {
			"$eq": compare_value
		}
	} else if (operator === 'DOES_NOT_EQUAL') {
		valueMatchObj = {
			"$ne": compare_value
		}
	} else if (operator === 'STARTS_WITH' ||
		operator === 'ENDS_WITH' ||
		operator === 'CONTAINS' ||
		operator === 'DOES_NOT_CONTAIN') {
		if (typeof compare_value !== 'string') {
			throw new UserInputError(`Operator ${operator} can only be used with strings!`)
		}
		let regExp: string;
		if (operator === 'STARTS_WITH') {
			regExp = `^${compare_value}`;
		} else if (operator === 'ENDS_WITH') {
			regExp = `${compare_value}$`;
		} else if (operator === 'CONTAINS') {
			regExp = `${compare_value}`;
		} else {
			regExp = `${compare_value}`;
		}

		valueMatchObj = (operator === 'DOES_NOT_CONTAIN' ? {
			"$not": {
				"$regex": new RegExp(regExp, "i")
			}
		} : {
			"$regex": new RegExp(regExp, "i")
		})

	} else if (operator === 'GREATER_THAN' ||
		operator === 'LESS_THAN' ||
		operator === 'GREATER_THAN_OR_EQUAL' ||
		operator === 'LESS_THAN_OR_EQUAL' ||
		operator === 'IS_BETWEEN') {
		if (operator === 'IS_BETWEEN') {
			// it needs to be an array
			if (!Array.isArray(compare_value)) throw new UserInputError(`IS_BETWEEN expects an array`)
			if (compare_value.length != 2) throw new UserInputError(`IS_BETWEEN expects an array with exactly 2 elements`)
			if (typeof compare_value[0] !== 'number') throw new UserInputError('Type of all elements should be number')
			// Note we don't need to check the type of all elements our CustomScaler ensures that the array is homogenous
			valueMatchObj = {
				"$gte": compare_value[0],
				"$lte": compare_value[1],
			}
		} else {
			if (typeof compare_value !== 'number') throw new UserInputError(`${operator} must get a single number as compare_value`)
			if (operator === 'GREATER_THAN') {
				valueMatchObj = {
					"$gt": compare_value
				}
			} else if (operator === 'GREATER_THAN_OR_EQUAL') {
				valueMatchObj = {
					"$gte": compare_value
				}
			} else if (operator === 'LESS_THAN') {
				valueMatchObj = {
					"$lt": compare_value
				}
			} else if (operator === 'LESS_THAN_OR_EQUAL') {
				valueMatchObj = {
					"$lte": compare_value
				}
			}
		}
	} else if (operator === 'DATE_IS_BEFORE' ||
		operator === 'DATE_IS_AFTER' ||
		operator === 'DATE_IS_BETWEEN') {
		// validate date
		if (operator === 'DATE_IS_BETWEEN') {
			// should be an array
			if (!Array.isArray(compare_value)) throw new UserInputError(`DATE_IS_BETWEEN expects an array`)
			else if (compare_value.length != 2) throw new UserInputError(`DATE_IS_BETWEEN expects an array with exactly 2 elements`)
			else if (typeof compare_value[0] !== 'string') throw new UserInputError('Date must be in ISO format as a string');
			compare_value.forEach((e: any) => {
				if (!Yup.date().isValidSync(e)) throw new UserInputError(`ISO Date string ${e} is invalid`)
			})
			valueMatchObj = {
				"$gte": new Date(compare_value[0]),
				"$lte": new Date(compare_value[1]),
			}
		} else {
			if (typeof compare_value !== 'string') throw new UserInputError('Date must be in ISO format as a string');
			if (!Yup.date().isValidSync(compare_value)) throw new UserInputError(`ISO Date string ${compare_value} is invalid`)
			if (operator === 'DATE_IS_AFTER') {
				valueMatchObj = {
					"$gte": new Date(compare_value),
				}
			} else {
				valueMatchObj = {
					"$lte": new Date(compare_value),
				}
			}
		}
	} else if (operator === 'CONTAINS_ALL_OF' ||
		operator === 'CONTAINS_ANY_OF' ||
		operator === 'CONTAINS_NONE_OF') {
		// should be an array
		if (!Array.isArray(compare_value)) throw new UserInputError(`Operator ${operator} expects an array!`)

		if (operator === 'CONTAINS_ALL_OF') {
			// using $all and not $in, since I want all of them to be present
			valueMatchObj = {
				"$all": compare_value
			}
		} else if (operator === 'CONTAINS_ANY_OF') {
			valueMatchObj = {
				"$in": compare_value
			}
		} else if (operator === 'CONTAINS_NONE_OF') {
			valueMatchObj = {
				"$nin": compare_value
			}
		}
	} else {
		throw new UserInputError(`Operator ${operator} is not supported yet`);
	}

	return valueMatchObj;
}
