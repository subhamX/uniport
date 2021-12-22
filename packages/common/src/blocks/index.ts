import * as Yup from 'yup'


export const supportedFieldsArray = <const>[
	'text',
	'date',
	'email',
	'integer',
	'float',
	// markdown doesn't support multi_type==1 or 2;
	'markdown'
]

// to be used by frontend to have default values while allowing students/admin to add a data block
// ! Must be used for multi-type===0 only!
export const supportedFieldsDefaultValues = {
	'text': "",
	'date': new Date().toDateString(),
	'email': "",
	'integer': 0,
	'float': 0.1,
	'markdown': "",
}

export type SupportedFieldsType = typeof supportedFieldsArray[number]

/**
 * Method to validate a value with with it's blockType
 * @param blockType
 * @param value
 * @returns
 */
export const validateValueWithSupportedBlockType = (blockType: SupportedFieldsType, value: string | number) => {
	if (typeof value !== 'string' && typeof value !== 'number') throw new Error("LogicError: Only strings and integers are allowed for validation. Wrap integer/floats to strings in JSON Encoded Array!")

	let isValid = true;

	if (blockType === 'text' || blockType === 'markdown') {
		isValid = typeof value === 'string' && Yup.string().isValidSync(value);
	} else if (blockType === 'integer') {
		isValid = typeof value === 'number' && Yup.number().integer().strict(true).isValidSync(value);
	} else if (blockType === 'float') {
		isValid = typeof value === 'number' && Yup.number().isValidSync(value);
	} else if (blockType === 'email') {
		isValid = typeof value === 'string' && Yup.string().email().isValidSync(value);
	} else if (blockType === 'date') {
		isValid = typeof value === 'string' && Yup.date().isValidSync(value);
	} else {
		throw new Error("Adding value for the given block definition is not supported yet! Please raise an issue!")
	}
	return isValid;
}
