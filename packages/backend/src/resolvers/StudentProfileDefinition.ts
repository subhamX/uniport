import {  ForbiddenError, UserInputError } from "apollo-server-errors";
import { authenticatedUsersOnly } from "../config/auth/authCheckers"
import { dbClient } from "../db";
import { CustomApolloContext } from "../types/CustomApolloContext";
import { ObjectId } from "mongodb";
import { FieldSchemaType, StudentProfileDefinitionModelType } from "src/models/StudentProfileDefinition";
import { AddStudentProfileDefinitionInput, FieldSchemaInput, validateValueWithSupportedBlockType } from "@uniport/common";


export const studentProfileDefinitionResolver = {
	Query: {
		/**
		 * Method to resolve query for student profile definition for the organization the STUDENT/ADMIN is part of
		 * The user must be authenticated to use this method
		 */
		getStudentProfileDefinitions: async (_: any, args: any, ctx: CustomApolloContext) => {
			authenticatedUsersOnly(ctx.req);

			let res = dbClient.collection('student_profile_definition').find({
				org_id: ctx.req.user?.org_id
			}).sort({ position: 1 });

			// I know that at max no client shall add more than 20-30 blocks!
			const docs = await res.toArray();
			return docs;
		}

	},
	Mutation: {
		/**
		 * Method to resolve the Mutation for student profile definition block
		 * Only authenticated ADMIN can perform this operation
		 */
		addStudentProfileDefinition: async (_: any, { payload }: { payload: AddStudentProfileDefinitionInput }, ctx: CustomApolloContext) => {
			// check auth status
			authenticatedUsersOnly(ctx.req);

			// must be an admin
			if (ctx.req.user?.access_role !== 'ADMIN') {
				throw new ForbiddenError("You need to be admin to perform this action")
			}

			if (payload.field_defs.length === 0) {
				throw new UserInputError("There should be at least one block inside structure")
			}

			// push all of them at once
			let fieldDefs: FieldSchemaType[] = [];

			// 9 fields
			for (let item of payload.field_defs) {
				// validate everything. :)
				validateStudentProfileDefinitionField(item);

				fieldDefs.push({
					_id: new ObjectId(),
					field_name: item.field_name,
					multi_type: item.multi_type as any,
					position: item.position,
					required: item.required,
					type: item.type,
					options: item.options ?? [],
				});
			}

			const doc: StudentProfileDefinitionModelType = {
				_id: new ObjectId(),
				block_name: payload.block_name,
				is_array: payload.is_array,
				is_freezed: payload.is_freezed,
				is_required: payload.is_required,
				org_id: new ObjectId(ctx.req.user.org_id),
				position: payload.position ?? 0,
				requires_proof: payload.requires_proof,
				field_defs: fieldDefs
			}
			await dbClient.collection('student_profile_definition').insertOne(doc);

			return doc;
		}
	}
}


/**
 * Method to validate student profile definition block
 *
 * @param item student profile definition block
 */
export const validateStudentProfileDefinitionField = (item: FieldSchemaInput) => {
	if (item.multi_type === 0 && item.options && item.options.length) {
		throw new UserInputError("Options cannot be defined for multi_type 0!")
	} else if (item.multi_type !== 0 && item.type === 'markdown') {
		throw new UserInputError(`markdown doesn't support multi_type ${item.multi_type}!`)
	}
	if (item.multi_type !== 0) {
		const options = item.options;
		if (!options.length) {
			throw new UserInputError(`Options are necessary multi_type ${item.multi_type}!`)
		}
		// check if the options are valid
		// ensure that the options given are adhering the type
		options.forEach((e: any) => {
			if (!validateValueWithSupportedBlockType(item.type, e)) {
				throw new UserInputError(`option ${e} isn't of type ${item.type}`)
			}
		})
	}
}

