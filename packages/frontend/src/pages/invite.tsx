import { useMutation } from "@apollo/client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Layout from "../components/AuthLayout/Layout";
import HeadMeta from "../components/HeadMeta/HeadMeta";
import { INVITE_NEW_USERS_MUTATION } from "../graphql/InviteNewUsers";


const InviteUsers = () => {
	const [mutationFn, { data, loading, error }] = useMutation(INVITE_NEW_USERS_MUTATION);
	const handleSubmit = async (e) => {
		// TODO: check that individual mails are valid
		let emails = [];
		e.user_emails.split(/[\s]+/).map((text: string) => {
			// validation will be done at server
			if (text) emails.push(text);
		})

		await mutationFn({
			variables: {
				payload: {
					user_emails: emails,
					access_role: e.access_role,
				}
			}
		})
	}
	return (
		<>

			<div>
				<HeadMeta title='Uniport | Manage Campaign' />
				<Layout>
					<div className='p-10'>
						<div className='font-bold text-xl mt-7 mb-3'>
							Invite Users to Organization
						</div>

						{error ? <div className='my-3 text-sm text-left text-red-600 bg-red-500 bg-opacity-10 border border-red-400 flex items-center p-4 rounded-md'>Something went wrong: {error.message}</div> : null}
						{data ? <div className='my-3 text-sm text-left text-green-600 bg-green-500 bg-opacity-10 border border-green-400 flex items-center p-4 rounded-md'>Users added successfully</div> : null}

						<Formik
							initialValues={{ access_role: 'ADMIN', user_emails: '' }}
							// validationSchema={formFieldsValidationSchema}
							onSubmit={handleSubmit}
						>

							<Form className='text-black' autoComplete='off' >
								<div className="mb-4 flex items-center justify-start gap-7">
									<label htmlFor="access_role">Access Role:</label>
									<Field
										component="select"
										id="access_role"
										name="access_role"
										className='outline-none border-2 px-1 text-sm rounded-lg border-gray-300'
									>
										<option value="ADMIN">ADMIN</option>
										<option value="STUDENT">STUDENT</option>
									</Field>
									<p className="text-red-500 text-xs mt-1">
										<ErrorMessage name='access_role' />
									</p>
								</div>

								<Field
									component="textarea"
									id="user_emails"
									name="user_emails"
									rows={4}
									placeholder='Please enter all emails newline or space separated'
									className='w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none'
								>
								</Field>
								{/* <textarea className="" rows={4}></textarea> */}

								<div className="flex items-center justify-end">
									<button type="submit"
										disabled={loading}
										className="btn bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Send Invite</button>
								</div>
							</Form>
						</Formik>
					</div>
				</Layout>
			</div>
		</>
	)
}

export default InviteUsers;
