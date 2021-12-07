import passportLocal from 'passport-local';
import { dbClient } from "../../db";
import { UserModelType } from '../../models/User';
import bcrypt from 'bcrypt';

const LocalStrategy = passportLocal.Strategy;

/**
 * Implements authentication using Passport Local strategy
 *
 * Note: Although currently we are using session auth, consider migrating to
 * JWT based approach later where we shall keep ["email", "org_id" and "access_role"] as payload
 */
export const localStrategyConfig = new LocalStrategy(
	async function (email, password, done) {
		try {
			const res = await dbClient.collection('user').findOne({ email_address: email });
			// check if user exist
			if (!res) throw Error("Username doesn't exist");

			const user = res as unknown as UserModelType;

			// check if passwords match
			const bcryptRes = await bcrypt.compare(password, user.hashed_password);
			if (!bcryptRes) throw Error('Incorrect Password');

			// successful auth
			done(undefined, user);
		} catch (err) {
			return done(undefined, false, { message: err.message })
		}
	}
);
