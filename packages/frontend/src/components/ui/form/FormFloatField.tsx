import { ErrorMessage, Field } from "formik";

export const FormFloatField = ({
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
			step={0.1}
			name={fieldId}
			placeholder={placeholder ?? "Choose a number"}
			className="form-field"
		/>
		<p className="text-red-500 text-xs mt-1">
			<ErrorMessage name={fieldId} />
		</p>
	</div>
);
