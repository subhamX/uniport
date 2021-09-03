import HeadMeta from "../components/views/HeadMeta";
import NonAuthNavbar from "../components/views/NonAuthNavbar";
import UniversalForm from "../components/views/UniversalForm";
import { useState } from "react";
import React from 'react';
import { SignupFields, SignupSchema } from "@uniport/common";




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