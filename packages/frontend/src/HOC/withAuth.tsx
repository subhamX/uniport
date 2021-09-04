import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { FETCH_CURRENT_USER } from "../graphql/FetchCurrentUser";



const withAuth = (WrappedComponent) => {
	return (props) => {
		const Router = useRouter();
		let { data, loading } = useQuery(FETCH_CURRENT_USER);

		if (loading) {
			// TODO: move it to some nice UI component. (along with withNoAuth)
			return (
				<div>
					Auth status resolving
				</div>
			)
		}

		if (data) {
			return <WrappedComponent {...props} />;
		}

		Router.replace("/login/");
		return null;
	};
};

export default withAuth;
