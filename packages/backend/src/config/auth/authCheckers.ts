import { AuthenticationError } from "apollo-server-errors";
import { Request } from "express";

/**
 * Method to check if the request user is not authenticated
 * It throws an error if the user is authenticated
 *
 * @param req Express request object
 */
export const nonAuthenticatedUsersOnly = (req: Request) => {
	if (req.user || req.isAuthenticated()) {
		throw new AuthenticationError("Route is only for non authenticated users");
	}
}


/**
 * Method to check if the request user is authenticated
 * It throws an error if the user is not authenticated
 *
 * @param req Express request object
 */
export const authenticatedUsersOnly = (req: Request) => {
	if (!req.user || req.isUnauthenticated()) {
		throw new AuthenticationError("Route is only for authenticated users");
	}
}
