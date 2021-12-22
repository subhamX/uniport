import { ErrorMessage, Field, useField } from "formik";

export const FormSingleSelectField = ({
	fieldId,
	fieldLabel,
	options,
	isInline,
}: {
	fieldId: string;
	fieldLabel: string;
	options: { value: string; label: string }[];
	isInline?: boolean;
}) => {
	return (
		<div className="mb-4">
			<div className={isInline ? "form-inline-group" : "form-group"}>
				<label className="form-label" htmlFor={fieldId}>
					{fieldLabel}
				</label>
				<Field
					component="select"
					id={fieldId}
					name={fieldId}
					className="form-field"
				>
					{/* <option>
						Select an option
					</option> */}
					{options.map((e, indx) => (
						<option value={e.value} key={indx}>
							{e.label}
						</option>
					))}
				</Field>

				<p className="text-red-500 text-xs mt-1">
					<ErrorMessage name={fieldId} />
				</p>
			</div>
		</div>
	);
};
