import axios from 'axios';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();

		if (!process.env.NEXT_PUBLIC_WORDPRESS_API_URL) {
			return NextResponse.error();
		}

		const tokenEndpoint = `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/headless_wp/v2/create-event`;

		const response = await axios.post(tokenEndpoint, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		return NextResponse.json({
			success: true,
			data: response.data,
		});
	} catch (error) {
		console.error('An error occurred:', error);
		return NextResponse.error();
	}
}
