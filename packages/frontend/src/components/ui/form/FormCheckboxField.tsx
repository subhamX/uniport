import { ErrorMessage, Field } from "formik";


export const FormCheckboxField = ({
	fieldId,
	fieldLabel,
}: {
	fieldId: string;
	fieldLabel: string;
}) => (
	<div className="form-inline-group">
		<label className="form-label" htmlFor={fieldId}>
			{fieldLabel}
		</label>
		<Field
			type="checkbox"
			id={fieldId}
			name={fieldId}
			className="form-checkbox"
		/>
		<p className="text-red-500 text-xs mt-1">
			<ErrorMessage name={fieldId} />
		</p>
	</div>
);
