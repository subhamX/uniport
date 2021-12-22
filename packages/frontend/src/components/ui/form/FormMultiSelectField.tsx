import { ErrorMessage, Field, useField, useFormikContext } from "formik";
import Select from "react-select";

export const FormMultiSelectField = ({
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
	const { values, setFieldValue, getFieldProps } = useFormikContext();
	const value = getFieldProps(fieldId).value;

	const getValue = () => {
		if (value) {
			return options.filter(option => value.indexOf(option.value) >= 0)
		} else {
			return []
		}
	};


	return (
		<div className="mb-4">
			<div className={isInline ? "form-inline-group" : "form-group"}>
				<label className="form-label" htmlFor={fieldId}>
					{fieldLabel}
				</label>
				<Select
					name={fieldId}
					onChange={(option) => {
						setFieldValue(fieldId, option.map((item) => item.value))
					}}
					isMulti={true}
					value={getValue()}
					styles={{
						option: (provided, state) => ({
							...provided,
							background: '#fffcee',
							fontSize: '14px',
							padding: '0.625em',
							paddingRight: '8px',
							paddingLeft: '8px',
							border: '1px solid black',
							color: state.isSelected ? 'red' : 'blue',
						}),
						menuList: (provided, state) => ({
							...provided,
							// background: 'red',
							background: '#fffcee',
							padding: 0,
						}),
						control: (provided, state) => ({
							...provided,
							// none of react-select's styles are passed to <Control />
							background: '#fffcee',
							outline: 'none',
							borderRadius: '0',
							border: '2px solid black',
							borderColor: 'black',
						}),
					}}
					options={options}
				/>


				<p className="text-red-500 text-xs mt-1">
					<ErrorMessage name={fieldId} />
				</p>
			</div>
		</div>
	);
};
