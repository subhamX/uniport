import { ErrorMessage, Field } from "formik"

// must be used inside Formik
export const FormBlockDateInput = ({ id, label }) => {
	return (
		<div className="mb-4">
			<div className='form-inline-group'>
				<label className="form-label" htmlFor={id}>
					{label}
				</label>
				<Field
					id={id}
					type='date'
					name={id}
					className='shadow appearance-none border rounded text-sm w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
				/>
				<p className="text-red-500 text-xs mt-1">
					<ErrorMessage name={id} />
				</p>
			</div>
		</div>
	)
}
