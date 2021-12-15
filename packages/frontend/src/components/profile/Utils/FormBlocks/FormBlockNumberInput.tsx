import { ErrorMessage, useField } from "formik";



export const FormBlockNumberInput = ({ id, step, label }) => {
	const [field, meta, helpers] = useField({ type: 'number', name: id, });
	const { setValue } = helpers;

	return (
		<div className="mb-4">
			<div className='form-inline-group'>
				<label className="form-label" htmlFor={id}>
					{label}
				</label>
				<input
					id={id}
					type='number'
					name={id}
					value={field.value}
					step={step ?? '0.1'}
					onChange={(event) => setValue(event.currentTarget.value)}
					className='shadow appearance-none border rounded text-sm w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
				/>
				<p className="text-red-500 text-xs mt-1">
					<ErrorMessage name={id} />
				</p>
			</div>
		</div>
	)
}
