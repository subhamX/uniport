import * as Yup from "yup";
import Image from "next/image";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useMutation, useQuery } from "@apollo/client";
import router from "next/router";
import { toast } from "react-toastify";
import HeadMeta from "../../../components/HeadMeta/HeadMeta";
import NonAuthNavbar from "../../../components/NonAuthNavbar/NonAuthNavbar";
import { ButtonPrimary } from "../../../components/ui/buttons/ButtonPrimary";
import withNoAuth from "../../../HOC/withNoAuth";
import FormTextField from "../../../components/ui/form/FormTextField";
import { REGISTER_WITH_UNIQUE_TOKEN } from "../../../config/routes-config";

const formValidationSchema = Yup.object().shape({
	unique_token: Yup.string().uuid().required(),
});

const Login = () => {
	const handleSubmit = async (e: { unique_token: string }) => {
		router.push(REGISTER_WITH_UNIQUE_TOKEN(e.unique_token));
	};

	return (
		<div>
			<HeadMeta title="Uniport | Join the organization" />
			<NonAuthNavbar />
			<div className="main-container w-full pt-4 overflow-y-scroll">
				<div className="form-container">
					<div className="heading-text text-center">Join the organization</div>

					{/* Actual Form */}
					<Formik
						initialValues={{ unique_token: "" }}
						validationSchema={formValidationSchema}
						onSubmit={handleSubmit}
					>
						<Form className="text-black" autoComplete="off">
							<div>
								<FormTextField
									fieldLabel="Unique Token"
									fieldId="unique_token"
									placeholder="a560a359-c698-4123-a9b4-5df03826855a"
									isInline={true}
								/>

								<ButtonPrimary type="submit">
									Join the organization
								</ButtonPrimary>
							</div>
						</Form>
					</Formik>
				</div>
			</div>
		</div>
	);
};

export default withNoAuth(Login);
