import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const link = createHttpLink({
	uri: new URL("graphql/", SERVER_URL).href,
	credentials: 'include'
});

// https://stackoverflow.com/questions/66597918/how-can-i-cache-nested-objects-with-apollo-client
// https://github.com/apollographql/router/issues/87
const client = new ApolloClient({
	cache: new InMemoryCache(),
	link
});

export default client;
