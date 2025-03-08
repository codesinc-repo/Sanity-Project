import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

import { QUERY_THEME_REDIRECTS } from '@/data/redirects';

export async function redirectsOptions() {
	const apolloClient = new ApolloClient({
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

	const { data } = await apolloClient.query({
		query: QUERY_THEME_REDIRECTS,
	});

	return data?.themeRedirects?.themeGeneralRedirects?.redirects;
}
