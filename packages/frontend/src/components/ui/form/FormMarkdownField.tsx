import { Field, useFormikContext } from "formik";
import DatePicker from "react-datepicker";
// import MDEditor from "@uiw/react-md-editor";
// import '@uiw/react-md-editor/dist/markdown-editor.css';
// import '@uiw/react-markdown-preview/dist/markdown.css';

export const FormMarkdownField = ({
	fieldId,
	fieldLabel,
	placeholder,
}: {
	fieldId: string;
	fieldLabel: string;
	placeholder?: string;
}) => {
	const { setFieldValue, getFieldProps } = useFormikContext();
	const value = getFieldProps(fieldId).value;
	// the code below doesn't work, as there can be nested fields!
	// const value = values[fieldId];

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

			{/* <MDEditor
				value={value}
				onChange={(value) => setFieldValue(fieldId, value)}
			/> */}
			{/* <MDEditor.Markdown source={value} /> */}
		</div>
	);
};
