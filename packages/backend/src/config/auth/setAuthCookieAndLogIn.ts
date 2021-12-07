import { Request } from "express";
import { UserModelType } from "../../models/User";

/**
 * Method to use Passport login method to login the user
 *
 * @param req Express Request Object
 * @param userData instance of user
 * @returns Promise with dummy payload. It shall enable the caller to wait for the complete operation before moving further
 */
export const setAuthCookieAndLogIn = async (req: Request, userData: UserModelType) => {
	return new Promise((resolve, reject) => {
		req.login(userData, (err) => {
			if (err) throw Error("Something went wrong with passport.")
			// user logged in successfully
			resolve(1);
		})
	});
}
