import { useMutation, useQuery } from "@apollo/client";
import HeadMeta from "../../../../components/HeadMeta/HeadMeta";
import Layout from "../../../../components/AuthLayout/Layout";
import { FETCH_CAMPAIGN_DETAILS_BY_ID } from "../../../../graphql/FetchCampaignData";
import { useRouter } from "next/router";
import GenericModal from "../../../../components/GenericModal/GenericModal";
import { Dispatch, SetStateAction, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { AddFilteringFormikField } from "./addprofile";
import { INVITE_NEW_USERS_MUTATION } from "../../../../graphql/InviteNewUsers";
import { ADD_STUDENTS_TO_CAMPAIGN_MUTATION } from "../../../../graphql/AddStudentsToCampaign";
import { AddStudentsToCampaignInput, CampaignDetails } from "@uniport/common";
import { toast } from "react-toastify";
import { ButtonSecondary } from "../../../../components/ui/buttons/ButtonSecondary";
import { ButtonPrimary } from "../../../../components/ui/buttons/ButtonPrimary";

const ManageCampaign = () => {
	const router = useRouter();

	let { camp_id } = router.query;

	// Initially camp_id remains undefined. But we still call /graphql/; How to fix it?
	// So to fix it we are having the following check.
	if (!camp_id) return null;

	let { data, loading, error } = useQuery(FETCH_CAMPAIGN_DETAILS_BY_ID, {
		variables: {
			campaign_id: camp_id,
		},
	});

	const [showAddNewRuleModal, setshowAddNewRuleModal] = useState(false);

	const campDetails: CampaignDetails = data
		? data.getCampaignDetailsById
		: null;

	return (
		<div>
			<HeadMeta title="Uniport | Manage Campaign" />
			<Layout>
				<div className="p-10">
					{loading ? <div>Loading Campaign Details</div> : null}
					{error ? <div>Something went wrong: {error.message}</div> : null}

					{campDetails ? (
						<div>
							<div className="heading-text mb-3">Manage Campaign</div>
							{/* info box */}
							<div className="info-box text-blue-600 bg-blue-500">
								<span className="text-blue-800 font-medium">
									Note on campaign rules:
								</span>{" "}
								<span>
									Typically you should all those rules which are part of the
									college placement policy. Please note that whenever you add a
									new rule it applies to all future job profiles in the
									campaign. Incase you wish to add some rules for specific job
									profiles kindly add that while defining the job profile.
								</span>
							</div>

							<div className="description-card-wrapper">
								<div className="description-group">
									<div className="description-group-key">Campaign Name</div>
									<div className="description-group-value">
										{campDetails.campaign_name}
									</div>
								</div>
								<div className="description-group">
									<div className="description-group-key">
										Number of students
									</div>
									<div className="description-group-value">
										{campDetails.number_of_students}
									</div>
								</div>
								<div className="description-group">
									<div className="description-group-key">
										Number of job offers
									</div>
									<div className="description-group-value">
										{campDetails.number_of_offers}
									</div>
								</div>
								<div className="description-group">
									<div className="description-group-key">
										Number of students with at least one offer
									</div>
									<div className="description-group-value">
										{campDetails.number_of_placed_students}
									</div>
								</div>
								<div className="description-group">
									<div className="description-group-key">
										Total number of job profiles created
									</div>
									<div className="description-group-value">
										{campDetails.number_of_job_profiles}
									</div>
								</div>
								<div className="description-group">
									<div className="description-group-key">Campaign Rules</div>
									<div className="description-group-value">No Rules found</div>
								</div>
							</div>

							<div className="flex justify-end">
								<ButtonPrimary
									disabled
									onClick={() => setshowAddNewRuleModal(true)}
								>
									Add new rule
								</ButtonPrimary>
							</div>

							<InviteUsers _id={camp_id} />
						</div>
					) : null}
				</div>
			</Layout>
		</div>
	);
};

export default ManageCampaign;

const InviteUsers = ({ _id }) => {
	const [mutationFn, { data, loading, error }] = useMutation(
		ADD_STUDENTS_TO_CAMPAIGN_MUTATION
	);
	const handleSubmit = async (e) => {
		// TODO: check that individual mails are valid
		try {
			let emails = [];
			e.user_emails.split(/[\s]+/).map((text: string) => {
				// validation will be done at server
				if (text) emails.push(text);
			});

			const payload: AddStudentsToCampaignInput = {
				student_emails: emails,
				_id,
			};
			await mutationFn({
				variables: {
					payload,
				},
			});
			toast("Users added successfully");
		} catch (err) {
			console.log("Error: ", err);
			toast(`Something went wrong: ${err.message}`, { type: "error" });
		}
	};
	return (
		<>
			<div className="subheading-text mt-7">Add Students to this campaign</div>

			<Formik
				initialValues={{ user_emails: "" }}
				onSubmit={handleSubmit}
			>
				<Form className="text-black" autoComplete="off">
					<Field
						component="textarea"
						id="user_emails"
						name="user_emails"
						rows={4}
						placeholder="Please enter all emails newline or space separated"
						className="textarea-field"
					></Field>

					<div className="flex items-center justify-end">
						<ButtonSecondary type="submit" disabled={loading}>
							Submit
						</ButtonSecondary>
					</div>
				</Form>
			</Formik>
		</>
	);
};
