import axios from 'axios';
import { NextResponse } from 'next/server';

const API_URL = `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/headless_wp/v2/get-events`;

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);

	const lang = searchParams.get('lang') || 'en';
	const perPage = searchParams.get('per_page') || '9';
	const page = searchParams.get('page') || '1';

	try {
		const response = await axios.get(API_URL, {
			params: {
				lang,
				per_page: perPage,
				page,
			},
		});

		const eventsData = response.data;

		return NextResponse.json(eventsData, { status: 200 });
	} catch (error: any) {
		console.error('Error fetching events:', error);
		return NextResponse.json({ message: 'Error fetching events' }, { status: 500 });
	}
}
