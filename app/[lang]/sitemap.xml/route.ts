import urlJoin from 'url-join';

import { sitemapOptions } from '../../../src/lib/sitemapOptions';

interface PostProps {
	uri: string;
	modified: string;
}

const host = process.env.NEXT_PUBLIC_SITE_URL;

function generateSiteMap(posts: PostProps[]) {
	return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
      ${posts
			.map((post) => {
				if (post?.uri === '/' || !host) return '';

				const currentUri = post?.uri.includes(host) ? post?.uri : urlJoin(host, post?.uri);

				return `
            <url>
              <loc>${currentUri}</loc>
              <lastmod>${post.modified}</lastmod>
            </url>
          `;
			})
			.join('')}
    </urlset>`;
}

export async function GET() {
	try {
		const posts = await sitemapOptions();
		const body = generateSiteMap(posts);

		return new Response(body, {
			status: 200,
			headers: {
				'Cache-control': 'public, s-maxage=86400, stale-while-revalidate',
				'content-type': 'application/xml',
			},
		});
	} catch (error) {
		console.error('Error generating sitemap:', error);

		return new Response('Internal Server Error', {
			status: 500,
			headers: {
				'content-type': 'text/plain',
			},
		});
	}
}
