import { ErrorMessage, Field } from "formik";

export const FormEmailField = ({
	fieldId,
	fieldLabel,
	placeholder,
	isInline,
}: {
	fieldId: string;
	placeholder?: string;
	isInline?: boolean;
	fieldLabel: string;
}) => (
	<div className={isInline ? "form-inline-group" : "form-group"}>
		<label className="form-label" htmlFor={fieldId}>
			{fieldLabel}
		</label>
		<Field
			id={fieldId}
			name={fieldId}
			type="email"
			placeholder={placeholder}
			className="form-field"
		/>
		<p className="text-red-500 text-xs mt-1">
			<ErrorMessage name={fieldId} />
		</p>
	</div>
);
