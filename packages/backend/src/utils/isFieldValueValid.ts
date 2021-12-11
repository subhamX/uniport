import { validateValueWithSupportedBlockType } from "@uniport/common";
import { UserInputError } from "apollo-server-core";
import { StudentProfileFieldValueType } from "../models/StudentProfile";
import { FieldSchemaType } from "../models/StudentProfileDefinition";


/**
 * Utility function to validate if a field value (of a block) in the student profile is valid
 *
 * It checks for the types of the value/values in the fieldValue and throws error if there are any discrepancy
 *
 * @param fieldDefinition definition of the field (not of block)
 * @param fieldValue value of the field
 */
 export const isFieldValueValid = (fieldDefinition: FieldSchemaType, fieldValue: StudentProfileFieldValueType) => {
	const blockType = fieldDefinition.type;
	const multi_type = fieldDefinition.multi_type;
	const options = fieldDefinition.options;
	const isArray = Array.isArray(fieldValue);

	// pushing all values into an array for convenience
	const values: (string | number)[] = [];
	if (multi_type === 0 || multi_type === 1) {
		if (isArray) throw new UserInputError(`multi_type ${multi_type} cannot have an array as value`)
		values.push(fieldValue);
	} else {
		if (!isArray) throw new UserInputError("Value should be an encoded JSON array");
		fieldValue.forEach(e => values.push(e));
	}

	values.forEach((value, indx) => {
		if (indx && value === values[0]) throw new UserInputError("The value array cannot have duplicates.")
		// check for types
		if (!validateValueWithSupportedBlockType(fieldDefinition.type, value)) {
			throw new UserInputError(`value ${JSON.stringify(value)} isn't of type ${blockType}`)
		}

		if (multi_type !== 0) {
			// the given value should be one of the defined one
			const foundDoc = options?.findIndex(e => e === value);
			if (foundDoc === -1) throw new UserInputError(`The given value ${JSON.stringify(value)} isn't present in options ${JSON.stringify(fieldDefinition.options)}`);
		}
	})
}
