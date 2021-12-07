

import { GraphQLScalarType, Kind } from 'graphql';
import { checkIfArrayElementsAreOfGivenType } from './ArrayScalar';

export type FieldValueType = string | number | string[] | number[]

/**
 * Method to decode the JSON encoded string to FieldValue
 *
 * It throws error if there are any discrepancy
 * @param value JSON encoded string
 * @returns: JSON decoded value
 */
const evalStringToFieldValue = (value: string) => {
	const val = JSON.parse(value as string);

	if (Array.isArray(val)) {
		if (!checkIfArrayElementsAreOfGivenType(val, 'string') && !checkIfArrayElementsAreOfGivenType(val, 'number')) {
			throw new Error("All array elements must be of same type, and can be of number/string type only!")
		}
	} else {
		// it should be either string/number
		if ((typeof val !== 'string') && (typeof val !== 'number')) {
			throw new Error("Only number/string type are allowed!")
		}
	}

	return val;
}

/**
 * Definition for the FieldValueScalar type
 *
 * It expects a JSON encoded string/string[]/number/number[] from the client!
 * If the value is an array then it must have all the elements of same type, and the type can be string or number only!
 */
export const FieldValueScalar = new GraphQLScalarType({
	name: 'FieldValueScalar',
	description: '',
	serialize(value) {
		// it can be string, int, float, or object
		// we shall serialize it
		return JSON.stringify(value); // Convert outgoing FieldValue to JSON
	},
	parseValue(value) {
		// we are receiving from the client.
		// it should be a proper JSON encoded string
		if (typeof value === 'string') {
			const val = JSON.parse(value as string);
			return val;
		}
		throw new Error(`Value should be an encoded JSON in string format`)
	},
	parseLiteral(ast) {
		if (ast.kind === Kind.STRING) return evalStringToFieldValue(ast.value);
		throw new Error(`Value should be an encoded JSON in string format`)
	}
});
