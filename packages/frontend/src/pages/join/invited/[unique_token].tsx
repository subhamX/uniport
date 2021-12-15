import HeadMeta from "../../../components/HeadMeta/HeadMeta";
import NonAuthNavbar from "../../../components/NonAuthNavbar/NonAuthNavbar";
import React, { useEffect } from "react";
import { useMutation } from "@apollo/client";
import {
	RegisterAdminInputForm,
	RegisterWithValidInviteInput,
	registerWithValidInviteInputFormValidationSchema,
	User,
} from "@uniport/common";
import {
	ErrorMessage,
	Field,
	Form,
	Formik,
	useFormikContext,
	yupToFormErrors,
} from "formik";
import { useRouter } from "next/router";
import { BRIDGE_DASHBOARD } from "../../../config/routes-config";
import withNoAuth from "../../../HOC/withNoAuth";
import { REGISTER_WITH_VALID_INVITE_MUTATION } from "../../../graphql/RegisterWithValidInviteMutation";
import * as Yup from "yup";
import { toast } from "react-toastify";
import FormTextField from "../../../components/ui/form/FormTextField";
import { FormEmailField } from "../../../components/ui/form/FormEmailField";
import { ButtonPrimary } from "../../../components/ui/buttons/ButtonPrimary";

const initialValues: RegisterWithValidInviteInput & {
	password_confirm: string;
} = {
	first_name: "",
	last_name: "",
	email_address: "",
	unique_token: "",
	password: "",
	password_confirm: "",
};

// For admin

const SignUpWithAnInvite = () => {
	// NOTE: Unlike useQuery, useMutation doesn't execute its operation automatically on render. Instead, you call this mutate function.
	const [mutateFunction, { data, loading: waitingForServerResponse, error }] =
		useMutation<{ registerWithValidInvite: RegisterWithValidInviteInput }>(
			REGISTER_WITH_VALID_INVITE_MUTATION
		);
	const router = useRouter();

	let unique_token = router.query.unique_token as string;

	// submit handler
	const handleSubmit = async (e) => {
		console.log(e);
		try {
			let { password_confirm, ...tmp } = e;
			const payload = {
				...tmp,
				unique_token,
			};
			await mutateFunction({
				variables: {
					registerWithValidInvitePayload: payload,
				},
			});
			toast("Registration successful. 🚀🚀");
		} catch (err) {
			toast(err.message, {type: "error"});
			console.log(`Error: ${err.message}`);
		}
	};

	if (data && data.registerWithValidInvite) {
		// redirecting
		console.log("Successfully registered");
		router.push(BRIDGE_DASHBOARD);
	}

	useEffect(() => {
		if (
			unique_token &&
			!Yup.string().uuid().required().isValidSync(unique_token)
		) {
			toast("Invalid UUID. Redirecting to Home...", {
				onClose: () => router.push("/"),
				autoClose: 3000,
			});
		}
	}, [unique_token]);

	return (
		<div>
			<HeadMeta title="Uniport | Join the Club" />
			<NonAuthNavbar />
			<div className="main-container w-full mt-4 overflow-y-scroll">
				<div className="form-container">
					<div className="heading-text text-center">
						Join Uniport | Invite Only
					</div>

					<div className="info-box text-purple-600 bg-purple-500" role="alert">
						Please note that this registration form is only for those who
						received an invite from their institute admins. Please ensure that
						you use the same email on which you got the invitation mail.
					</div>

					{/* Actual Form */}
					<div>
						<Formik
							initialValues={{ ...initialValues, unique_token }}
							validationSchema={
								registerWithValidInviteInputFormValidationSchema
							}
							onSubmit={handleSubmit}
						>
							<Form className="text-black" autoComplete="off">
								<FormTextField
									fieldId="first_name"
									fieldLabel="First Name"
									placeholder="Steve"
								/>
								<FormTextField
									fieldId="last_name"
									fieldLabel="Last Name"
									placeholder="Kurt"
								/>

								<FormEmailField
									fieldId="email_address"
									fieldLabel="Email Address"
									placeholder="steve@mail.com"
								/>

								<div className="form-group">
									<label className="form-label" htmlFor="password">
										Password
									</label>
									<Field
										name="password"
										type="password"
										id="password"
										autoComplete="off"
										placeholder="*******"
										className="form-field"
									/>
									<p className="text-red-500 text-xs mt-1">
										<ErrorMessage name="password" />
									</p>
								</div>

								<div className="mb-4">
									<label className="form-label" htmlFor="password_confirm">
										Password Confirm
									</label>
									<Field
										name="password_confirm"
										type="password"
										id="password_confirm"
										autoComplete="off"
										placeholder="*******"
										className="form-field"
									/>
									<p className="text-red-500 text-xs mt-1">
										<ErrorMessage name="password_confirm" />
									</p>
								</div>

								<div className="flex items-center justify-between">
									<ButtonPrimary
										type="submit"
										disabled={waitingForServerResponse}
									>
										Join Uniport
									</ButtonPrimary>
								</div>
							</Form>
						</Formik>
						{/* OTP Form */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default withNoAuth(SignUpWithAnInvite);
