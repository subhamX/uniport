import HeadMeta from "../components/views/HeadMeta";
import NonAuthNavbar from "../components/views/NonAuthNavbar";
import * as Yup from 'yup';
import UniversalForm from "../components/views/UniversalForm";
import { useState } from "react";
import React from 'react';

const SignupSchema = Yup.object().shape({
	firstName: Yup.string()
		.min(2, 'Too Short!')
		.max(50, 'Too Long!')
		.required('Required'),
	lastName: Yup.string()
		.min(2, 'Too Short!')
		.max(50, 'Too Long!')
		.required('Required'),
	email: Yup.string().email('Invalid email').required('Required'),
	password1: Yup.string()
		.required('Please enter the password'),
	password2: Yup.string().oneOf([Yup.ref('password1'), undefined], 'Passwords are different')
		.required('Please confirm the password')
});



// currently supports
// "text"
type SignupFields = {
	firstName: string,
	lastName: string,
	email: string,
	password1: string,
	password2: string
}




const SignUpFormFields: { id: keyof SignupFields; label: string, type: string }[] = [
	{
		id: 'firstName',
		label: 'First Name',
		type: 'text'
	},
	{
		id: 'lastName',
		label: 'Last Name',
		type: 'text'
	},
	{
		id: 'email',
		label: 'Email',
		type: 'email'
	},
	{
		id: 'password1',
		label: 'Password',
		type: 'password'
	},
	{
		id: 'password2',
		label: 'Confirm Password',
		type: 'password'
	},
]


const initialValues: SignupFields = {
	firstName: '',
	lastName: '',
	email: '',
	password1: '',
	password2: ''
}

const JoinNow = () => {

	const handleSubmit = (e) => {
		console.log(e);
	}


	return (
		<div>
			<HeadMeta title='UniPort | Join the Club' />
			<NonAuthNavbar />
			<div className='w-full mt-4'>
				<div className="mx-auto p-4 max-w-md shadow-md rounded-md text-left">
					<div className='text-gray-700 text-3xl font-semibold text-center'>
						Join UniPort
					</div>

					<div className='my-3 text-sm text-left text-purple-600 bg-purple-500 bg-opacity-10 border border-purple-400 flex items-center p-4 rounded-md' role="alert">
						Please note that this registration form is only for institute admins. Incase you are a student and wish to register yourself on the portal, you shall ask for an invite from your institute admin.
					</div>

					{/* Actual Form */}
					<SignUpFlow>
						<UniversalForm
							initialValues={initialValues}
							formFieldsValidationSchema={SignupSchema}
							handleSubmit={handleSubmit}
							formFields={SignUpFormFields}
						/>
						{/* OTP Form */}



						{/* Redirect to  Dash */}
					</SignUpFlow>

				</div>
			</div>
		</div>
	)
}




export default JoinNow;


const SignUpFlow = ({ children }) => {
	const [step, setstep] = useState(0);
	const childrenArray = React.Children.toArray(children);
	const currentChild = childrenArray[step];
	const [completed, setCompleted] = useState(false);

	return (
		<>
			{children}
		</>
	)
}