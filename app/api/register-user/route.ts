import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const entryData = await req.json();
		const { body, lang } = entryData;

		if (!process.env.NEXT_PUBLIC_WORDPRESS_API_URL) {
			return NextResponse.error();
		}

		const tokenEndpoint = `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/headless_wp/v2/register-user`;

		const requestBody = {
			first_name: body?.input_11,
			last_name: body?.input_13,
			workplace: body?.input_15,
			email: body?.input_17,
			password: body?.input_20,
			lang,
		};

		try {
			const response = await axios.post(tokenEndpoint, requestBody);

			return NextResponse.json({
				success: true,
				data: response.data,
			});
		} catch (error) {
			return NextResponse.json({
				success: true,
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
