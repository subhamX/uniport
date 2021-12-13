import HeadMeta from "../components/HeadMeta/HeadMeta";
import NonAuthNavbar from "../components/NonAuthNavbar/NonAuthNavbar";
import * as Yup from 'yup';
import Image from 'next/image';
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useMutation, useQuery } from "@apollo/client";
import { loginExistingUser } from "../graphql/LoginExistingUser";
import withNoAuth from "../HOC/withNoAuth";
import router from "next/router";
import { toast } from "react-toastify";


type loginFormFields = {
	email_address: string,
	password: string,
}


const initialValues: loginFormFields = {
	email_address: '',
	password: '',
}

const formValidationSchema = Yup.object().shape({
	email_address: Yup.string().email().required(),
	password: Yup.string().min(6).required('Please enter the password'),
});

const Login = () => {

	const [mutationFn, { data, loading: waitingForServerResponse, error }] = useMutation(loginExistingUser);
	const handleSubmit = async (e) => {
		try {
			await mutationFn({
				variables: {
					...e
				}
			})
			toast('Login successful. 🚀🚀');
		} catch (err) {
			console.log(`Error: ${err.message}`);
			toast(err.message);
		}
	}

	if (data) {
		router.push('/dash/');
		return null;
	}

	return (
		<div>
			<HeadMeta title='Uniport | Login' />
			<NonAuthNavbar />
			<div className='main-container w-full pt-4 overflow-y-scroll'>
				<div className="form-container">
					<div className='heading-text text-center'>
						Login
					</div>


					{/* Actual Form */}
					<Formik
						initialValues={initialValues}
						validationSchema={formValidationSchema}
						onSubmit={handleSubmit}
					>

						<Form className='text-black' autoComplete='off'>

							<div className="mb-4">
								<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor='email_address'>
									Email address
								</label>
								<Field name='email_address'
									type='email'
									id='email_address'
									autoComplete='off'
									placeholder='steve@mail.com'
									className='form-field'
								/>
								<p className="text-red-500 text-xs mt-1">
									<ErrorMessage name='email_address' />
								</p>
							</div>
							<div className="mb-4">
								<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor='password'>
									Password
								</label>
								<Field name='password'
									type='password'
									id='password'
									autoComplete='off'
									placeholder='*******'
									className='form-field'
								/>
								<p className="text-red-500 text-xs mt-1">
									<ErrorMessage name='password' />
								</p>
							</div>

							<div className="flex items-center justify-between">
								<button type="submit"
									disabled={waitingForServerResponse}
									className="btn-primary">Login</button>
							</div>
						</Form>
					</Formik>



					<div className='mt-2 border-t-2'></div>

					<div className="w-full mt-4">
						<button
							className="btn flex gap-3 text-left bg-red-600 hover:bg-red-800 text-white w-full"
							type="button"
						>
							<Image src={require('../assets/images/google-logo.svg')} height={25} width={25} />
							<div>
								Login with Google
							</div>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}




export default withNoAuth(Login);

