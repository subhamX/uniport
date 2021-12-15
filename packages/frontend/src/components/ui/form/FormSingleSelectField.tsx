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
	// const [field, meta, helpers] = useField({ type: "text", name: id });
	// const { setValue } = helpers;
	// const { error, touched } = meta;

	return (
		<div className="mb-4">
			<div className={isInline ? "form-inline-group" : "form-group"}>
				<label className="form-label" htmlFor={fieldId}>
					{fieldLabel}
				</label>
				{/* <select
					name={id}
					onChange={(event) => {
						setValue(event.target.value);
					}}
					value={field.value}
					className="shadow border rounded w-full py-1 px-2 text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				>
					<option value="" label="Select an option" />
					{options.map((e, indx) => (
						<option key={indx} value={e.value} label={e.label} />
					))}
				</select> */}

				<Field
					component="select"
					id={fieldId}
					name={fieldId}
					className="form-field"
				>
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
