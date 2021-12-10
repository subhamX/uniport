import Express from 'express';
import { BACKEND_SERVER_PORT, CLIENT_ORIGIN, MONGO_URL, SESSION_SECRET_KEY } from './config/constants';
import { ApolloServer } from 'apollo-server-express';
import session from 'express-session';
import passport from 'passport';
import { dbClient } from './db';
import { UserModelType } from './models/User';
import { localStrategyConfig } from './config/auth/localStrategyConfig';
import { mergedResolvers } from './resolvers';
import http from 'http';
import { UserSchema } from './schema/User';
import cookie_parser from 'cookie-parser';
import cors from 'cors';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core/dist/plugin/landingPage/graphqlPlayground';
import { studentProfileDefinitionSchema } from './schema/StudentProfileDefinition';
import { campaignSchema } from './schema/Campaign';
import { studentProfileSchema } from './schema/StudentProfile';
import { inviteUsersSchema } from './schema/Invite';
import MongoDBStore from 'connect-mongodb-session';
import { companySchema } from './schema/Company';


const app = Express();
declare global {
	namespace Express {
		interface User extends UserModelType { }
	}
}


// express session
app.set('trust proxy', 1) // trust first proxy



app.use(cors({
	origin: CLIENT_ORIGIN,
	credentials: true,
}))

// using express sessions to keep track of the user
app.use(session({
	secret: SESSION_SECRET_KEY,
	name: 'uni_id',
	saveUninitialized: false,
	resave: true,
	cookie: {
		// secure: true,
		httpOnly: true,
		maxAge: 365 * 24 * 60 * 60 * 1000,
	},
	store: new (MongoDBStore(session))({
		uri: MONGO_URL,
		collection: 'mySessions'
	}),
}))

app.use(cookie_parser())
app.use(Express.json())


// instantiating passport with local strategy config
passport.use(localStrategyConfig);

// registering method for passport to serialize the user
passport.serializeUser<UserModelType, any>((user: UserModelType, done: any) => {
	done(null, user.email_address);
})

// registering method for passport to deserialize the user
passport.deserializeUser(async (email, done) => {
	try {
		const instance = await dbClient.collection('user').findOne({ "email_address": email });
		if (!instance) {
			throw Error("Passport: Invalid email");
		}
		let user = instance as unknown as UserModelType;
		done(null, user);

	} catch (err) {
		done(err, false);
	}
});

app.use(passport.initialize());
app.use(passport.session());


app.get('/', async (req, res) => {
	res.send({
		error: false,
		status: "OK"
	})
});


(async () => {
	const server = new ApolloServer({
		typeDefs: [
			UserSchema,
			studentProfileDefinitionSchema,
			campaignSchema,
			inviteUsersSchema,
			studentProfileSchema,
			companySchema
		],
		resolvers: mergedResolvers,
		context: ({ req, res }) => ({ req, res }),
		plugins: [
			ApolloServerPluginLandingPageGraphQLPlayground
		]
	});
	const httpServer = http.createServer(app);
	await server.start();
	server.applyMiddleware({ app, cors: false });

	await new Promise(resolve => httpServer.listen({ port: BACKEND_SERVER_PORT }, resolve as any));
	console.log(`🚀 Server ready at http://localhost:${BACKEND_SERVER_PORT}${server.graphqlPath}`);
})();


