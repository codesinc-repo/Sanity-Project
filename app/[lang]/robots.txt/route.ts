import { themeSettingsEN } from '@/lib/themeSettings';

export async function GET() {
	const { robotsTxt } = await themeSettingsEN();

	return new Response(robotsTxt, {
		status: 200,
		headers: {
			'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
			'Content-Type': 'text/plain',
		},
	});
}
