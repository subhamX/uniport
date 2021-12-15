import { Field } from "formik";

export const FormTextAreaField = ({
	fieldId,
	fieldLabel,
	placeholder,
}: {
	fieldId: string;
	fieldLabel: string;
	placeholder?: string;
}) => {
	return (
		<div className="form-group">
			<label className="form-label" htmlFor={fieldId}>
				{fieldLabel}
			</label>
			<Field
				name={fieldId}
				type="textarea"
				id={fieldId}
				as="textarea"
				rows={4}
				autoComplete="off"
				placeholder={placeholder}
				className="form-field"
			/>
		</div>
	);
};
