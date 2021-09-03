import HeadMeta from "../components/views/HeadMeta";
import NonAuthNavbar from "../components/views/NonAuthNavbar";
import * as Yup from 'yup';
import Image from 'next/image';
import UniversalForm from "../components/views/UniversalForm";


const loginFormValidators = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Required'),
	password: Yup.string()
		.required('Please enter the password'),
});



type loginFormFields = {
	email: string,
	password: string,
}


const loginFormFields: {
	id: keyof loginFormFields; label: string, type: string,
	placeholder?: string,
}[] = [
		{
			id: 'email',
			label: 'Email',
			type: 'email',
			placeholder: 'admin@tim.edu'
		},
		{
			id: 'password',
			label: 'Password',
			type: 'password'
		},
	]


const initialValues: loginFormFields = {
	email: '',
	password: '',
}

const Login = () => {

	const handleSubmit = (e) => {
		console.log(e);
	}

	return (
		<div>
			<HeadMeta title='UniPort | Login' />
			<NonAuthNavbar />
			<div className='w-full mt-4'>
				<div className="mx-auto p-4 max-w-md shadow-md rounded-md text-left">
					<div className='text-gray-700 text-3xl font-semibold text-center'>
						Login
					</div>

					{/* Actual Form */}
					<UniversalForm
						initialValues={initialValues}
						formFieldsValidationSchema={loginFormValidators}
						handleSubmit={handleSubmit}
						formFields={loginFormFields}
					/>

					<div className='border border-t-1 mt-2'></div>

					<div className="w-full">
						<button
							className="w-full flex gap-3 bg-red-700 hover:bg-red-800 text-white font-bold mt-5 mb-3 py-2 px-4 focus:outline-none focus:shadow-outline"
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




export default Login;

