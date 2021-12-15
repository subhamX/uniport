import { useFormikContext } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const FormDateField = ({
	fieldId,
	fieldLabel,
	isInline,
}: {
	fieldId: string;
	isInline: boolean;
	fieldLabel: string;
}) => {
	const {  setFieldValue, getFieldProps } = useFormikContext();
	const value = getFieldProps(fieldId).value;
	// the code below doesn't work, as there can be nested fields!
	// const value = values[fieldId];

	return (
		<div className={isInline ? "form-inline-group" : "form-group"}>
			<label className="form-label" htmlFor={fieldId}>
				{fieldLabel}
			</label>
			<DatePicker
				selected={isNaN(Date.parse(value)) ? new Date() : new Date(value)}
				className="form-field"
				name={fieldId}
				onChange={(date) => {
					setFieldValue(fieldId, date ? date.toISOString() : "");
				}}
			/>
		</div>
	);
};
