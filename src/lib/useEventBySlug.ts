import * as process from 'node:process';

import axios from 'axios';

export async function useEventBySlug(slug: string | string[], use_rank_math = true) {
	try {
		const response = await axios.get(
			`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/headless_wp/v2/get-event-by-slug`,
			{ params: { slug: Array.isArray(slug) ? slug[0] : slug, use_rank_math } },
		);

		return response.data;
	} catch (error: any) {
		console.log('Error:', error?.response?.data?.message);
	}
}
