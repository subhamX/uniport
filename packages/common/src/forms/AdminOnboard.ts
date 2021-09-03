import * as Yup from 'yup';


export type SignupFields = {
    firstName: string,
    lastName: string,
    email: string,
    password1: string,
    password2: string
}


export const SignupSchema = Yup.object().shape({
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


