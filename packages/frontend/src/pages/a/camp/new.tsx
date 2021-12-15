import { ErrorMessage, Field, Form, Formik } from "formik";
import HeadMeta from "../../../components/HeadMeta/HeadMeta";
import Layout from "../../../components/AuthLayout/Layout";
import * as Yup from "yup";
import { useMutation } from "@apollo/client";
import { CREATE_A_NEW_CAMPAIGN } from "../../../graphql/CreateANewCampaign";
import Router from "next/router";
import { MANAGE_CAMP } from "../../../config/routes-config";
import { FETCH_MY_CAMPAIGNS } from "../../../graphql/FetchMyCampaigns";
import { toast } from "react-toastify";
import router from "next/router";
import { ButtonPrimary } from "../../../components/ui/buttons/ButtonPrimary";

type FormFields = {
	campaign_name: string;
};

const initialValues = {
	campaign_name: "",
};

const formValidationSchema = Yup.object().shape({
	campaign_name: Yup.string().required().min(4),
});

const CreateNewCampaign = () => {
	const [mutationFn, { data, loading: waitingForServerResponse, error }] =
		useMutation(CREATE_A_NEW_CAMPAIGN, {
			refetchQueries: [FETCH_MY_CAMPAIGNS, "fetchMyCampaigns"],
		});

	const handleSubmit = async (e: FormFields) => {
		try {
			await mutationFn({
				variables: {
					...e,
				},
			});
			toast("Campaign creation successful! 🎉");
		} catch (err) {
			toast(err.message, {
				type: "error",
			});
		}
	};

	if (data) {
		// new campaign creation was successful
		Router.push(MANAGE_CAMP(data.createANewCampaign._id));
		return null;
	}

	return (
		<div>
			<HeadMeta title="Uniport | Create new Campaign" />
			<Layout>
				<div className="p-10">
					<div className="w-full mt-4">
						<div className="form-container">
							<div className="heading-text text-center pb-3">
								Create a new campaign
							</div>

							<Formik
								initialValues={initialValues}
								validationSchema={formValidationSchema}
								onSubmit={handleSubmit}
							>
								<Form className="text-black" autoComplete="off">
									<div className="mb-4">
										<label className="form-label" htmlFor="campaign_name">
											Campaign Name
										</label>
										<Field
											name="campaign_name"
											type="text"
											id="campaign_name"
											autoComplete="off"
											placeholder="Internship Drive 2k22"
											className="form-field"
										/>
										<p className="text-red-500 text-xs mt-1">
											<ErrorMessage name="campaign_name" />
										</p>
									</div>

									<div className="flex items-center justify-between">
										<ButtonPrimary
											type="submit"
											disabled={waitingForServerResponse}
										>
											Submit
										</ButtonPrimary>
									</div>
								</Form>
							</Formik>
						</div>
					</div>
				</div>
			</Layout>
		</div>
	);
};

export default CreateNewCampaign;
