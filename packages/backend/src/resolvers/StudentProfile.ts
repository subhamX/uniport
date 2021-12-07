// the following options shall be used only by admin

import { ForbiddenError, UserInputError } from "apollo-server-core";
import { authenticatedUsersOnly } from "../config/auth/authCheckers";
import { dbClient } from "../db";
import { CustomApolloContext } from "../types/CustomApolloContext";
import { GetStudentProfileByQueryInput, MutateStudentProfileBlockDataInput } from '@uniport/common'
import { ObjectId } from "mongodb";
import { StudentProfileDefinitionFieldDefType, StudentProfileDefinitionModelType } from "../models/StudentProfileDefinition";
import * as Yup from 'yup'
import { StudentProfileBlockDataType } from "../models/StudentProfile";
import { isFieldValueValid } from "../utils/isFieldValueValid";

export const studentProfileResolvers = {
	Query: {
		/**
		 * Method to query all the student records in the organization and send the filtered results
		 * Only authenticated users with ADMIN scope can perform this operation
		 *
		 * We aren't performing any validation, as it makes the filtering process very slow. It's the client duty to pass things rightly. Failing to do it will cause EMPTY results!
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

			const limit = payload.page_size > 25 ? 25 : payload.page_size;
			const stages: any[] = [];

			for (let condition of payload.conditions) {
				const blockDefId = new ObjectId(condition.block_def_id);
				const fieldId = new ObjectId(condition.field_id);
				// block_id -> student_def_block
				// field_id -> individual field inside it

				console.log(condition.compare_value);
				if ((condition.operator === 'IS_EMPTY' || condition.operator === 'IS_NOT_EMPTY')) {
					if (condition.compare_value !== undefined) throw new UserInputError(`Operator: ${condition.operator} doesn't require CompareValue`)
				} else {
					if (!condition.compare_value) throw new UserInputError(`Operator: ${condition.operator} require CompareValue`)
				}

				if (condition.operator === 'EQUALS') {
					stages.push({
						"$match": {
							"blocks_data.block_def_id": blockDefId,
							"blocks_data.field_data": {
								"$elemMatch": {
									"_id": fieldId,
									"value": {
										"$eq": condition.compare_value
									}
								}
							}
						}
					})
				} else if (condition.operator === 'DOES_NOT_EQUAL') {
					stages.push({
						"$match": {
							"blocks_data.block_def_id": blockDefId,
							"blocks_data.field_data": {
								"$elemMatch": {
									"_id": fieldId,
									"value": {
										"$ne": condition.compare_value
									}
								}
							}
						}
					})
				} else if (condition.operator === 'STARTS_WITH' ||
					condition.operator === 'ENDS_WITH' ||
					condition.operator === 'CONTAINS' ||
					condition.operator === 'DOES_NOT_CONTAIN') {
					if (typeof condition.compare_value !== 'string') {
						throw new UserInputError(`Operator ${condition.operator} can only be used with strings!`)
					}
					let regExp: string;
					if (condition.operator === 'STARTS_WITH') {
						regExp = `^${condition.compare_value}`;
					} else if (condition.operator === 'ENDS_WITH') {
						regExp = `${condition.compare_value}$`;
					} else if (condition.operator === 'CONTAINS') {
						regExp = `${condition.compare_value}`;
					} else {
						regExp = `${condition.compare_value}`;
					}

					stages.push({
						"$match": {
							"blocks_data.block_def_id": blockDefId,
							"blocks_data.field_data": {
								"$elemMatch": {
									"_id": fieldId,
									"value": (condition.operator === 'DOES_NOT_CONTAIN' ? {
										"$not": {
											"$regex": new RegExp(regExp, "i")
										}
									} : {
										"$regex": new RegExp(regExp, "i")
									})
								}
							}
						}
					})
				} else if (condition.operator === 'GREATER_THAN' ||
					condition.operator === 'LESS_THAN' ||
					condition.operator === 'GREATER_THAN_OR_EQUAL' ||
					condition.operator === 'LESS_THAN_OR_EQUAL' ||
					condition.operator === 'IS_BETWEEN') {
					let valueMatchObj = {};
					if (condition.operator === 'IS_BETWEEN') {
						// it needs to be an array
						if (!Array.isArray(condition.compare_value)) throw new UserInputError(`IS_BETWEEN expects an array`)
						if (condition.compare_value.length != 2) throw new UserInputError(`IS_BETWEEN expects an array with exactly 2 elements`)
						if (typeof condition.compare_value[0] !== 'number') throw new UserInputError('Type of all elements should be number')
						// Note we don't need to check the type of all elements our CustomScaler ensures that the array is homogenous
						valueMatchObj = {
							"$gte": condition.compare_value[0],
							"$lte": condition.compare_value[1],
						}
					} else {
						if (typeof condition.compare_value !== 'number') throw new UserInputError(`${condition.operator} must get a single number as compare_value`)
						if (condition.operator === 'GREATER_THAN') {
							valueMatchObj = {
								"$gt": condition.compare_value
							}
						} else if (condition.operator === 'GREATER_THAN_OR_EQUAL') {
							valueMatchObj = {
								"$gte": condition.compare_value
							}
						} else if (condition.operator === 'LESS_THAN') {
							valueMatchObj = {
								"$lt": condition.compare_value
							}
						} else if (condition.operator === 'LESS_THAN_OR_EQUAL') {
							valueMatchObj = {
								"$lte": condition.compare_value
							}
						}
					}

					stages.push({
						"$match": {
							"blocks_data.block_def_id": blockDefId,
							"blocks_data.field_data": {
								"$elemMatch": {
									"_id": fieldId,
									"value": valueMatchObj
								}
							}
						}
					})
				} else if (condition.operator === 'DATE_IS_BEFORE' ||
					condition.operator === 'DATE_IS_AFTER' ||
					condition.operator === 'DATE_IS_BETWEEN') {
					// validate date
					let valueMatchObj = {}
					if (condition.operator === 'DATE_IS_BETWEEN') {
						// should be an array
						if (!Array.isArray(condition.compare_value)) throw new UserInputError(`IS_BETWEEN expects an array`)
						if (condition.compare_value.length != 2) throw new UserInputError(`IS_BETWEEN expects an array with exactly 2 elements`)
						if (typeof condition.compare_value[0] !== 'string') throw new UserInputError('Date must be in ISO format as a string');
						condition.compare_value.every((e: string) => {
							if (!Yup.date().isValidSync(e)) throw new UserInputError(`ISO Date string ${e} is invalid`)
						})
						valueMatchObj = {
							"$gte": new Date(condition.compare_value[0]),
							"$lte": new Date(condition.compare_value[1]),
						}
					} else {
						if (typeof condition.compare_value !== 'string') throw new UserInputError('Date must be in ISO format as a string');
						if (!Yup.date().isValidSync(condition.compare_value)) throw new UserInputError(`ISO Date string ${condition.compare_value} is invalid`)
						if (condition.operator === 'DATE_IS_AFTER') {
							valueMatchObj = {
								"$gte": new Date(condition.compare_value),
							}
						} else {
							valueMatchObj = {
								"$lte": new Date(condition.compare_value),
							}
						}
					}
					stages.push({
						"$match": {
							"blocks_data.block_def_id": blockDefId,
							"blocks_data.field_data": {
								"$elemMatch": {
									"_id": fieldId,
									"value": valueMatchObj
								}
							}
						}
					})


				} else if (condition.operator === 'CONTAINS_ALL_OF' ||
					condition.operator === 'CONTAINS_ANY_OF' ||
					condition.operator === 'CONTAINS_NONE_OF') {
					// should be an array
					if (!Array.isArray(condition.compare_value)) throw new UserInputError(`Operator ${condition.operator} expects an array!`)

					let valueMatchObj;
					if (condition.operator === 'CONTAINS_ALL_OF') {
						// using $all and not $in, since I want all of them to be present
						valueMatchObj = {
							"$all": condition.compare_value
						}
					} else if (condition.operator === 'CONTAINS_ANY_OF') {
						valueMatchObj = {
							"$in": condition.compare_value
						}
					} else if (condition.operator === 'CONTAINS_NONE_OF') {
						valueMatchObj = {
							"$nin": condition.compare_value
						}
					}
					stages.push({
						"$match": {
							"blocks_data.block_def_id": blockDefId,
							"blocks_data.field_data": {
								"$elemMatch": {
									"_id": fieldId,
									"value": valueMatchObj
								}
							}
						}
					})

				} else {
					throw new UserInputError(`Operator ${condition.operator} is not supported yet`);
				}
			}

			// TODO: add sort by name, filter and pageSize
			const cursor = dbClient.collection('student_profile').aggregate(stages);
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

			const fieldDefs = doc.field_defs as unknown as StudentProfileDefinitionFieldDefType[];

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
