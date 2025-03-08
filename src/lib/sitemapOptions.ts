import { QUERY_POSTS_AND_PAGES_SEO } from '@/data/seo';

import { getClient } from './apolloClient';

export async function sitemapOptions() {
	const { data } = await getClient().query({
		query: QUERY_POSTS_AND_PAGES_SEO,
	});

	return [...data.pages.nodes, ...data.posts.nodes];
}
