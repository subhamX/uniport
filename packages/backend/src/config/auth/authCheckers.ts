import { Request } from "express";


export const nonAuthenticatedUsersOnly = (req: Request) => {
	if (req.user || req.isAuthenticated()) {
		throw Error("Route is only for non authenticated users");
	}
}


export const authenticatedUsersOnly = (req: Request) => {
	if (!req.user || req.isUnauthenticated()) {
		throw Error("Route is only for authenticated users");
	}
}
