import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';

export const { getClient } = registerApolloClient(() => {
	return new ApolloClient({
		link: new HttpLink({
			uri: process.env.NEXT_PUBLIC_WORDPRESS_API_GRAPHQL_URL,
			useGETForQueries: true,
		}),
		cache: new InMemoryCache(),
		ssrMode: true,
		defaultOptions: {
			query: {
				fetchPolicy: 'cache-first',
			},
		},
	});
});
