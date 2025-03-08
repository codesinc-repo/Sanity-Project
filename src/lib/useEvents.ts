import * as process from 'node:process';

import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/headless_wp/v2/get-events`;

export async function useEvents(postsPerPage: number = 9, page: number = 1) {
	try {
		const response = await axios.get(API_URL, {
			params: {
				per_page: postsPerPage,
				page,
			},
		});
		return response.data;
	} catch (error: any) {
		console.log('Error:', error?.response?.data?.message);
	}
}
