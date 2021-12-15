import { ErrorMessage, Field } from "formik";

export const FormIntegerField = ({
	fieldLabel,
	fieldId,
	placeholder,
	isInline,
}: {
	fieldLabel: string;
	fieldId: string;
	placeholder?: string;
	isInline: boolean;
}) => (
	<div className={isInline ? "form-inline-group" : "form-group"}>
		<label className="form-label" htmlFor={fieldId}>
			{fieldLabel}
		</label>
		<Field
			type="number"
			id={fieldId}
			name={fieldId}
			placeholder={placeholder ?? "Choose an integer"}
			className="form-field"
		/>
		<p className="text-red-500 text-xs mt-1">
			<ErrorMessage name={fieldId} />
		</p>
	</div>
);
