import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

const SERVER_URL=process.env.NEXT_PUBLIC_SERVER_URL;

const link = createHttpLink({
	uri: new URL("graphql/", SERVER_URL).href,
	credentials: 'include'
});

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link
});

export default client;
