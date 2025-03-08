import {
	QUERY_PAGE_BY_SLUG_WITH_RANK_MATH_SEO,
	QUERY_PAGE_BY_SLUG_WITH_YOAST_SEO,
} from '@/data/pages';

import { getClient } from './apolloClient';

interface IBlock {
	blockName: string;
	blockData: string;
}

interface IPage {
	uri: string;
	blocks?: IBlock[];
	seo?: any;
	rankMathRobots?: any;
	yoastRobots?: any;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export async function pageSettings(
	slug: string[] | string,
	lang: string,
	seoVariant: boolean,
): Promise<IPage | null> {
	if (!SITE_URL) return null;

	const variablesSlug = Array.isArray(slug) ? slug.join('/') : `${slug}`;
	const entryUrl = new URL(variablesSlug === `${lang}/home` ? '/' : `${variablesSlug}/`, SITE_URL)
		.href;

	try {
		const { data } = await getClient().query({
			query: seoVariant
				? QUERY_PAGE_BY_SLUG_WITH_RANK_MATH_SEO
				: QUERY_PAGE_BY_SLUG_WITH_YOAST_SEO,
			variables: { variablesSlug },
		});

		if (!data?.pageBy || !SITE_URL) {
			return null;
		}

		const currentUri = new URL(data.pageBy.uri, SITE_URL).href;

		if (currentUri === entryUrl) {
			const updatedBlocks = (data.pageBy.blocks || []).map(
				({ blockData, ...block }: IBlock) => ({
					...block,
					blockData: blockData && JSON.parse(blockData),
				}),
			);

			return {
				...data.pageBy,
				blocks: updatedBlocks,
			};
		}

		return null;
	} catch (error) {
		console.error('Error fetching page data:', error);
		return null;
	}
}
