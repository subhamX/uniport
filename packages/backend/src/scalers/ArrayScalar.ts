

import { GraphQLScalarType, Kind } from 'graphql';

/**
 * Method to check if all the elements in the array are of give type
 *
 * @param val given test array
 * @param type given type with which we need to perform checks
 * @returns true or false
 */
export const checkIfArrayElementsAreOfGivenType = (val: any[], type: string) => {
	return val.every((val, indx, _) => typeof val === type);
}


/**
 * Method to evaluate string to an array of string or number
 *
 * It throws error if there are any discrepancy
 * @param value JSON encoded string
 * @returns: JSON decoded array of string/number
 */
const evalStringToArrayOfStringOrNumber = (value: string) => {
	const val = JSON.parse(value as string);
	if (!Array.isArray(val)) {
		throw Error("Value should be an encoded JSON array")
	}

	if (!checkIfArrayElementsAreOfGivenType(val, 'string') && !checkIfArrayElementsAreOfGivenType(val, 'number')) {
		throw new Error("All array elements must be of same type, and can be of number/string type only!")
	}

	return val;
}

/**
 * Definition for the ArrayScalar type
 *
 * The type expects a JSON encoded array from the client!
 * The array must have all the elements of same type, and the type can be string or number only!
 */
export const ArrayScalar = new GraphQLScalarType({
	name: 'ArrayScalar',
	description: '',
	serialize(value) {
		// it can be array of string, int, float
		// we shall serialize it
		return JSON.stringify(value); // Convert outgoing Array to JSON
	},
	parseValue(value) {
		// we are receiving from the client.
		// it should be a proper JSON encoded string
		if (typeof value === 'string') {
			return evalStringToArrayOfStringOrNumber(value);
		}
		throw Error("Value should be an encoded JSON array in string format")
	},
	parseLiteral(ast) {
		if (Kind.STRING === ast.kind) return evalStringToArrayOfStringOrNumber(ast.value);
		throw new Error(`Value should be an encoded JSON array in string format`)
	}
});
