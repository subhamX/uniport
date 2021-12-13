import 'tailwindcss/tailwind.css'
import '../styles/global.css'
import { ApolloProvider, useQuery } from "@apollo/client";
import client from "../apollo-client";
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { FETCH_CURRENT_USER } from '../graphql/FetchCurrentUser';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
	return (
		<ApolloProvider client={client}>
			<div className='font-body'>
				<Component {...pageProps} />
				<ToastContainer />
			</div>
		</ApolloProvider>
	)
}

export default MyApp
