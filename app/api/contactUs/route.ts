import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const entryData = await req.json();
		const { body, formId } = entryData;

		if (!process.env.NEXT_PUBLIC_WORDPRESS_API_URL) {
			return NextResponse.error();
		}

		const tokenEndpoint = `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/gf/v2/forms/${formId}/submissions`;

		try {
			const response = await axios.post(tokenEndpoint, body);

			return NextResponse.json({
				success: true,
				data: response.data,
			});
		} catch (error) {
			console.error('An error occurred:', error);
			return NextResponse.error();
		}
	} catch (error) {
		console.error('An error occurred:', error);
		return NextResponse.error();
	}
}
