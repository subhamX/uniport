import { MutateCompanyToOrgInput } from "@uniport/common";
import { ForbiddenError, UserInputError } from "apollo-server-core";
import { ObjectId } from "mongodb";
import { genericCompanyLogoUrl } from "../config/constants";
import { CompanyModelType } from "../models/Company";
import { authenticatedUsersOnly } from "../config/auth/authCheckers";
import { dbClient } from "../db";
import { CustomApolloContext } from "../types/CustomApolloContext";
import * as Yup from 'yup'

export const companyResolvers = {
	Query: {
		/**
		 * Method to resolve query to get base companies based on a specified pattern
		 *
		 * It shall be used by the web client to suggest company names.
		 */
		queryBaseCompanies: async (_: any, { query }: { query: string }, ctx: CustomApolloContext) => {
			const result = dbClient.collection('base_company').find({
				"name": {
					$regex: query
				}
			}).sort({ name: 1, _id: 1 }).limit(5)

			return (await result.toArray());
		},
		/**
		 * Method to resolve the query to get all companies in the org
		 *
		 * Only ADMIN can access this!
		 */
		getCompaniesInOrg: async (_: any, { pageSize: givenPageSize, offset }: { pageSize: number, offset: number }, ctx: CustomApolloContext) => {
			authenticatedUsersOnly(ctx.req);

			if (ctx.req.user?.access_role !== 'ADMIN') throw new ForbiddenError('Only admin can query the companies');

			const pageSize = givenPageSize > 25 ? 25 : givenPageSize;
			const companiesCursor=dbClient.collection('company').find({
				org_id: ctx.req.user.org_id
			}).sort({ name: 1, _id: 1 }).skip(offset).limit(pageSize)

			return (await companiesCursor.toArray());
		}
	},
	Mutation: {
		/**
		 * Method to resolve the ADMIN operation to add a new company to org or edit an existing company
		 *
		 * Only ADMIN can access this!
		 */
		mutateCompanyToOrg: async (_: any, { companyDetails }: { companyDetails: MutateCompanyToOrgInput }, ctx: CustomApolloContext) => {
			authenticatedUsersOnly(ctx.req);

			if (ctx.req.user?.access_role !== 'ADMIN') {
				throw new ForbiddenError('Only ADMIN can add/edit company');
			}
			const companyId = companyDetails._id ? new ObjectId(companyDetails._id) : new ObjectId();

			// validate that logo is valid URL
			if (companyDetails.logo_url !== undefined && !Yup.string().url().required().isValidSync(companyDetails.logo_url)) {
				throw new UserInputError('Invalid logo Url! Either enter a valid string with Logo Url or keep it as undefined')
			}

			const company: CompanyModelType = {
				_id: companyId,
				name: companyDetails.name,
				org_id: ctx.req.user.org_id,
				logo_url: companyDetails.logo_url ?? genericCompanyLogoUrl,
			}

			if (companyDetails._id) {
				// update mode
				const res = await dbClient.collection('company').updateOne({
					_id: companyId,
					org_id: ctx.req.user.org_id
				}, {
					$set: company
				})
				// we didn't find any match
				if (!res.matchedCount) throw new ForbiddenError('Invalid Company Id or company isn\'t in the Organization');
			} else {
				// insert mode
				await dbClient.collection('company').insertOne(company)
			}

			return company;
		}
	}
}



