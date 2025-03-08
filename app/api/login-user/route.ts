import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const entryData = await req.json();
		const { body } = entryData;

		if (!process.env.NEXT_PUBLIC_WORDPRESS_API_URL) {
			return NextResponse.error();
		}

		const tokenEndpoint = `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/headless_wp/v2/login-user`;

		const requestBody = {
			email: body?.input_24,
			password: body?.input_23,
		};

		try {
			const response = await axios.post(tokenEndpoint, requestBody);

			return NextResponse.json({
				success: true,
				data: response.data,
			});
		} catch (error) {
			return NextResponse.json({
				success: false,
				status: 400,
				// @ts-ignore
				data: error?.response?.data,
			});
		}
	} catch (error) {
		console.error('An error occurred:', error);
		return NextResponse.error();
	}
}
