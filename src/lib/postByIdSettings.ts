import { QUERY_POST_BY_ID_WITH_RANK_MATH_SEO, QUERY_POST_BY_ID_WITH_YOAST_SEO } from '@/data/posts';

import { getClient } from './apolloClient';

export async function postSettings(postId: number, seoVariant: boolean) {
	const { data } = await getClient().query({
		query: seoVariant ? QUERY_POST_BY_ID_WITH_RANK_MATH_SEO : QUERY_POST_BY_ID_WITH_YOAST_SEO,
		variables: { postId },
	});

	return data?.postBy;
}
