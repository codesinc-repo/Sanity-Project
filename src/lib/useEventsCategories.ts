import * as process from 'node:process';

import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/headless_wp/v2/get-events-category`;

export async function useEventsCategories(lang: string) {
	try {
		const response = await axios.get(API_URL, { params: { lang } });
		return response.data?.categories;
	} catch (error: any) {
		console.log('Error:', error?.response?.data?.message);
	}
}
