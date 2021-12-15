import { useMutation } from "@apollo/client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Layout from "../components/AuthLayout/Layout";
import HeadMeta from "../components/HeadMeta/HeadMeta";
import { INVITE_NEW_USERS_MUTATION } from "../graphql/InviteNewUsers";
import { toast } from "react-toastify";
import { ButtonPrimary } from "../components/ui/buttons/ButtonPrimary";

const InviteUsers = () => {
	const [mutationFn, { data, loading, error }] = useMutation(
		INVITE_NEW_USERS_MUTATION
	);
	const handleSubmit = async (e) => {
		try {
			// TODO: check that individual mails are valid
			let emails = [];
			e.user_emails.split(/[\s]+/).map((text: string) => {
				// validation will be done at server
				if (text) emails.push(text);
			});

			await mutationFn({
				variables: {
					payload: {
						user_emails: emails,
						access_role: e.access_role,
					},
				},
			});

			toast("Invited Users successfully!");
		} catch (err) {
			console.log(`Error: ${err}`);
			toast(`Something went wrong: ${err.message}`, { type: "error" });
		}
	};
	return (
		<>
			<div>
				<HeadMeta title="Uniport | Manage Campaign" />
				<Layout>
					<div className="form-container mt-10">
						<div className="heading-text text-2xl pb-3">
							Invite Users to Organization
						</div>

						<Formik
							initialValues={{ access_role: "ADMIN", user_emails: "" }}
							// validationSchema={formFieldsValidationSchema}
							onSubmit={handleSubmit}
						>
							<Form className="text-black" autoComplete="off">
								<div className="mb-4 flex items-center justify-start gap-7">
									<label htmlFor="access_role" className="w-full">
										Access Role:
									</label>
									<Field
										component="select"
										id="access_role"
										name="access_role"
										className="form-field"
									>
										<option value="ADMIN">ADMIN</option>
										<option value="STUDENT">STUDENT</option>
									</Field>
									<p className="text-red-500 text-xs mt-1">
										<ErrorMessage name="access_role" />
									</p>
								</div>

								<Field
									component="textarea"
									id="user_emails"
									name="user_emails"
									rows={4}
									placeholder="Please enter all emails newline or space separated"
									className="textarea-field"
								></Field>

								<div className="flex items-center justify-end">
									<ButtonPrimary type="submit" disabled={loading}>
										Send Invite
									</ButtonPrimary>
								</div>
							</Form>
						</Formik>
					</div>
				</Layout>
			</div>
		</>
	);
};

export default InviteUsers;
