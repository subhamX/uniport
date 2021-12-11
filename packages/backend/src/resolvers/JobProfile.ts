import { FilteringConditionInput, JobProfileAdvancedDetailsInput, JobProfileBasicDetailsInput, NewJobProfileInput } from "@uniport/common";
import { ForbiddenError, UserInputError } from "apollo-server-core";
import { ObjectId } from "mongodb";
import { dbClient } from "../db";
import { JobProfileModelType } from "../models/JobProfile";
import { authenticatedUsersOnly } from "../config/auth/authCheckers";
import { CustomApolloContext } from "../types/CustomApolloContext";
import { StudentProfileDefinitionModelType } from "src/models/StudentProfileDefinition";
import * as Yup from 'yup'
import { validateStudentProfileDefinitionField } from "./StudentProfileDefinition";


export const jobProfileResolvers = {
	Query: {
		/**
		 * Method to get the Job Profile details by id
		 */
		getJobProfileById: async (_: any, { _id }: { _id: string }, ctx: CustomApolloContext) => {
			authenticatedUsersOnly(ctx.req);

			const doc = await dbClient.collection('job_profile').findOne({
				_id: new ObjectId(_id),
				org_id: ctx.req.user?.org_id
			})
			if (!doc) throw new UserInputError('Invalid Job id');

			return doc;
		},
		/**
		 * Method to get all the Job Profiles for the given organization
		 *
		 * Supports pagination, and it can be accessed by anyone who is authenticated
		 *
		 * It is expected that the client using this API doesn't query for Company. (Since it's just a list view, try to fetch as minimum information as possible)
		 */
		getAllJobProfiles: async (_: any, { pageSize: givenPageSize, offset }: { pageSize: number, offset: number }, ctx: CustomApolloContext) => {
			authenticatedUsersOnly(ctx.req);
			const pageSize = (givenPageSize > 10) ? 10 : givenPageSize
			const cursor = dbClient.collection('job_profile').find({
				org_id: ctx.req.user?.org_id
			}).sort({
				deadline: -1,
				_id: 1,
			}).skip(offset).limit(pageSize);
			return (await cursor.toArray())
		}

	},
	Mutation: {
		/**
		 * Mutation to resolve the create new job profile request
		 *
		 * Only authenticated users with ADMIN access role can perform this operation.
		 *
		 * It returns the _id of the new job profile!
		 */
		createNewJobProfile: async (_: any, { payload }: { payload: NewJobProfileInput }, ctx: CustomApolloContext) => {
			authenticatedUsersOnly(ctx.req);

			if (ctx.req.user?.access_role !== 'ADMIN') throw new ForbiddenError('Only ADMIN can create a JobProfile');

			const org_id = ctx.req.user.org_id;
			const camp_id = new ObjectId(payload.camp_id);
			const company_id = new ObjectId(payload.company_id);

			// check if campaign id is valid
			const campaignDoc = await dbClient.collection('campaign').findOne({
				_id: camp_id,
				org_id
			})
			if (!campaignDoc) throw new UserInputError('Invalid campaign Id or invalid access!');

			// check if company id is valid
			const companyDoc = await dbClient.collection('company').findOne({
				_id: company_id,
				org_id
			})
			if (!companyDoc) throw new UserInputError('Invalid company Id or invalid access!');

			const deadline = new Date();
			deadline.setDate(deadline.getDate() + 1);

			const newJobProfile: JobProfileModelType = {
				_id: new ObjectId(),
				company_id,
				camp_id,
				org_id,
				title: '',
				stipend_low: 0,
				stipend_high: 0,
				description: '',
				deadline,
				creator_name: `${ctx.req.user.first_name} ${ctx.req.user.last_name}`,
				creator_uid: ctx.req.user._id,
				created_at: new Date(),
				rule_groups: [],
				additional_questions: [],
				is_complete: false,
				current_stage: 0,
				stages: [
					{
						_id: new ObjectId(),
						icon_url: '',
						stage_name: 'Application'
					},
					{
						_id: new ObjectId(),
						icon_url: '',
						stage_name: 'Resume Screening'
					},
					//
				],
				array_blocks_config: [],
				is_published: false,
			}
			await dbClient.collection('job_profile').insertOne(newJobProfile);

			return {
				...newJobProfile,
				company: companyDoc
			}
		},
		/**
		 * Method to update the job profile basic details
		 *
		 * Only authenticated ADMIN with access can edit the document
		 *
		 * Note: this can be modified even after the job is published. Since there can be some new communication which mandates the ADMIN to change the stipend etc
		 */
		updateJobProfileBasicDetails: async (_: any, { payload }: { payload: JobProfileBasicDetailsInput }, ctx: CustomApolloContext) => {
			authenticatedUsersOnly(ctx.req);
			if (ctx.req.user?.access_role !== 'ADMIN') throw new ForbiddenError('Only ADMIN can update the details of a JobProfile');

			const org_id = ctx.req.user.org_id;
			const jobProfileId = new ObjectId(payload.job_profile_id);

			const res = await dbClient.collection('job_profile').findOneAndUpdate({
				_id: jobProfileId,
				org_id: org_id,
			}, {
				$set: {
					title: payload.title,
					stipend_low: payload.stipend_low,
					stipend_high: payload.stipend_high,
					description: payload.description
				}
			}, { returnDocument: 'after' })

			if (!res.value) throw new ForbiddenError('Invalid Job profile Id or access denied!');

			return res.value;
		},
		/**
		 * Method to update the advanced details of the Job Profile
		 *
		 * The job must not be published, to perform this task. (More information on why is present in JobProfile schema)
		 * Only ADMIN can access this route
		 *
		 * Note: Here filtering with first_name, last_name and email_address isn't present. (As we know nobody adds a job profile and asks for filtering based on candidate names)!
		 */
		updateJobProfileAdvancedDetails: async (_: any, { payload }: { payload: JobProfileAdvancedDetailsInput }, ctx: CustomApolloContext) => {
			authenticatedUsersOnly(ctx.req);
			if (ctx.req.user?.access_role !== 'ADMIN') throw new ForbiddenError('Only ADMIN can update the details of a JobProfile');

			const org_id = ctx.req.user.org_id;
			const jobProfileId = new ObjectId(payload.job_profile_id);

			// if is_published then this cannot be performed
			if (!payload.rule_groups && !payload.additional_questions && !payload.additional_questions) {
				throw new UserInputError('You need to update at least one of the rule_groups, additional_questions or array_block_config')
			}

			const fieldsToUpdate: any = {

			}

			// fetching the student profile in one go, since there are a lot of times we are going to use it
			// and instead of performing multiple network request, let's have the whole thing once in for all.
			const studentProfileDefinitions = (await dbClient.collection('student_profile_definition').find({
				org_id,
			}).toArray() as any as StudentProfileDefinitionModelType[]);


			if (payload.rule_groups) {
				// payload.rule_groups
				// validate rules
				for (const ruleGroup of payload.rule_groups) {
					for (const condition of ruleGroup.conditions) {
						const definition = studentProfileDefinitions.find(e => e._id.toString() === condition.block_def_id);
						if (!definition) throw new UserInputError(`Invalid block_def_id: ${condition.block_def_id}`)
						if (definition.is_array) throw new UserInputError(`Profile definition of Array type cannot be added as a rule!`);
						validateFilteringConditionInput(condition, definition);
					}
				}
				fieldsToUpdate['rule_groups'] = payload.rule_groups.map(e => ({ _id: new ObjectId(), conditions: (e.conditions) }));
			}

			// validate additional questions
			if (payload.additional_questions) {
				fieldsToUpdate['additional_questions'] = []

				payload.additional_questions.forEach(item => {
					// validating
					validateStudentProfileDefinitionField(item);
					fieldsToUpdate['additional_questions'].push({
						_id: new ObjectId(),
						field_name: item.field_name,
						multi_type: item.multi_type as any,
						position: item.position,
						required: item.required,
						type: item.type,
						options: item.options ?? [],
					})
				})
			}


			if (payload.array_blocks_config) {
				// validate array blocks config
				// ensure that the block is indeed of type is_array=true
				payload.array_blocks_config.forEach(e => {
					const definition = studentProfileDefinitions.find(f => f._id.toString() === e._id);
					if (!definition) throw new UserInputError(`Invalid: ${definition}; No such block in student profile definition`);
					if (!definition.is_array) throw new UserInputError(`array blocks config should only choose those blocks of student profile blocks which are of type array!`);
					if (e.max_blocks < e.min_blocks) throw new UserInputError('max_blocks should be greater than min_blocks');
				})

				fieldsToUpdate['array_blocks_config'] = payload.array_blocks_config
			}


			// update the job profile
			const res = await dbClient.collection('job_profile').findOneAndUpdate({
				_id: jobProfileId,
				org_id: org_id,
				is_published: false,
			}, {
				$set: fieldsToUpdate
			}, { returnDocument: 'after' })

			if (!res.value) throw new ForbiddenError('Invalid Job profile Id, access denied, or job has already been published!');

			return res.value;
		},
		/**
		 * Method to publish the job profile
		 *
		 * The job must not be published, to perform this task. (More information on why is present in JobProfile schema)
		 * Only ADMIN can access this route
		 */
		publishJobProfile: async (_: any, { _id }: { _id: string }, ctx: CustomApolloContext) => {
			authenticatedUsersOnly(ctx.req);
			if (ctx.req.user?.access_role !== 'ADMIN') throw new ForbiddenError('Only ADMIN can publish the JobProfile');

			// update the job profile
			const res = await dbClient.collection('job_profile').findOneAndUpdate({
				_id: new ObjectId(_id),
				org_id: ctx.req.user.org_id,
				is_published: false,
				deadline: {
					"$gt": new Date()
				}
			}, {
				$set: {
					is_published: true
				}
			}, { returnDocument: 'after' })

			if (!res.value) throw new ForbiddenError('Invalid Job profile Id, access denied, job has already been published, or did you forgot to set the deadline?');

			return true;
		}
	},
	JobProfile: {
		/**
		 * Method to resolve the company details.
		 * Note that some of the resolvers might have the company data beforehand, in that case, they can set the `company` key!
		 * The following method shall respect that value and not perform any DB query!
		 *
		 * TODO: Use dataloader pattern to fix the N+1 issue
		 */
		company: async (jobProfileObj: JobProfileModelType, _: any, ctx: CustomApolloContext) => {
			authenticatedUsersOnly(ctx.req);

			if ((jobProfileObj as any).company) return (jobProfileObj as any).company;
			const company = await dbClient.collection('company').findOne({
				_id: jobProfileObj.company_id,
				org_id: jobProfileObj.org_id
			})

			return company
		}
	}

}




/**
 * Method to validate the filtering conditions, data types of the compare value and operator!
 *
 * @param condition Filtering condition
 * @param definition instance of student profile definition block (not field)
 */
export const validateFilteringConditionInput = (condition: FilteringConditionInput, definition: StudentProfileDefinitionModelType) => {
	const { operator, compare_value } = condition;

	// check if the field is inside `definition`
	const fieldElement = definition.field_defs.find(e => e._id.toString() === condition.field_id);
	if (!fieldElement) throw new UserInputError(`Invalid field_id: ${condition.field_id}`)

	const { type } = fieldElement

	const isBaseOperator = (operator === 'EQUALS' ||
		operator === 'DOES_NOT_EQUAL');

	const isDateOperator = (operator === 'DATE_IS_BEFORE' ||
		operator === 'DATE_IS_AFTER' ||
		operator === 'DATE_IS_BETWEEN');

	const isStringOperator = (operator === 'STARTS_WITH' ||
		operator === 'ENDS_WITH' ||
		operator === 'CONTAINS' ||
		operator === 'DOES_NOT_CONTAIN')

	const isNumberOperator = (operator === 'GREATER_THAN' ||
		operator === 'LESS_THAN' ||
		operator === 'GREATER_THAN_OR_EQUAL' ||
		operator === 'LESS_THAN_OR_EQUAL' ||
		operator === 'IS_BETWEEN')

	const isMultiOperator = (operator === 'CONTAINS_ALL_OF' ||
		operator === 'CONTAINS_ANY_OF' ||
		operator === 'CONTAINS_NONE_OF')

	const isFieldText = (type === 'text' ||
		type === 'markdown' ||
		type === 'email')

	if (fieldElement.multi_type === 2 && isMultiOperator) {
		// should be an array
		if (!Array.isArray(compare_value)) throw new UserInputError(`Operator ${operator} expects an array!`)
		// TODO: IDEALLY we should check if the values given by the ADMIN (compare_value array) has elements which are present in fieldElement.options; Later do it
		compare_value.forEach(e => {
			if (type == 'date') {
				if (!Yup.date().required().isValidSync(e)) throw new UserInputError(`value: ${e} should have been a valid date type`)
			} else if (type === 'float' || type === 'integer') {
				if (!Yup.number().required().isValidSync(e)) throw new UserInputError(`value: ${e} should have been a valid date type`)
			} else {
				// string
				if (!Yup.string().required().isValidSync(e)) throw new UserInputError(`value: ${e} should have been a valid date type`)
			}
		})
	} else if (((fieldElement.multi_type === 2 ? 1 : 0) ^ (isMultiOperator ? 1 : 0))) {
		throw new UserInputError(`${type} type isn't compatible with operator ${operator}`)
	} else {
		// neither multi_type===2 nor isMultiOperator is true

		// ensure that the condition.operator is valid for the given datatype
		if (type === 'date' && (isDateOperator || isBaseOperator)) {
			if (operator === 'DATE_IS_BETWEEN') {
				// it needs to be an array
				if (!Array.isArray(compare_value)) throw new UserInputError(`DATE_IS_BETWEEN expects an array`)
				if (compare_value.length != 2) throw new UserInputError(`DATE_IS_BETWEEN expects an array with exactly 2 elements`)

				// datatype check
				if (typeof compare_value[0] !== 'string') throw new UserInputError('Date must be in ISO format as a string');
				// Note we don't need to check the type of all elements our CustomScaler ensures that the array is homogenous
				compare_value.forEach(e => {
					if (Yup.date().required().isValidSync(e)) throw new UserInputError(`Invalid date: ${e}`);
				})
			} else {
				if (typeof compare_value !== 'string') throw new UserInputError('Date must be in ISO format as a string');
				if (Yup.date().required().isValidSync(compare_value)) throw new UserInputError(`Invalid date: ${compare_value}`);
			}
		} else if ((isFieldText) && (isStringOperator || isBaseOperator)) {
			if (typeof compare_value !== 'string') throw new UserInputError(`Operator ${operator} can only be used with strings!`)
		} else if ((type === 'integer' || type === 'float') && (isNumberOperator || isBaseOperator)) {
			if (operator === 'IS_BETWEEN') {
				// it needs to be an array
				if (!Array.isArray(compare_value)) throw new UserInputError(`IS_BETWEEN expects an array`)
				if (compare_value.length != 2) throw new UserInputError(`IS_BETWEEN expects an array with exactly 2 elements`)
				if (typeof compare_value[0] !== 'number') throw new UserInputError('Type of all elements should be number')
				// Note we don't need to check the type of all elements our CustomScaler ensures that the array is homogenous
			} else {
				if (typeof compare_value !== 'number') throw new UserInputError(`${operator} must get a single number as compare_value`)
			}
		} else {
			throw new UserInputError(`${type} type isn't compatible with operator ${operator}`)
		}
	}
}
