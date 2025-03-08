import type { Metadata } from 'next';
import React, { cache } from 'react';

import Error404 from '@/components/Error404';
import { Footer } from '@/components/Footer';
import Header from '@/components/Header';
import PageBlocks from '@/components/PageBlocks';
import { menuSettings } from '@/lib/menuSettings';
import { pageSettings } from '@/lib/pageSettings';
import { seoVariantEN, seoVariantSV } from '@/lib/seoVariant';
import { sitemapOptions } from '@/lib/sitemapOptions';
import { useEvents } from '@/lib/useEvents';

import type { Locale } from '../../../i18n-config';

const getPageSettings = cache(async (page: string, lang: Locale) => {
	const getSeoVariant = lang === 'en' ? seoVariantEN : seoVariantSV;
	const [menuProps, pages, eventsResponse, seoVariant] = await Promise.all([
		menuSettings(),
		sitemapOptions(),
		useEvents(),
		getSeoVariant(),
	]);

	return {
		menuProps,
		pages,
		seoVariant,
		eventsResponse,
		data: await pageSettings(page, lang, seoVariant),
	};
});

export async function generateMetadata({
	params,
}: {
	params: { slug: string; lang: Locale };
}): Promise<Metadata> {
	const { data, seoVariant } = await getPageSettings('kalender', params.lang);

	if (!data) return {};

	const robots = seoVariant ? data?.rankMathRobots : data?.yoastRobots;

	return {
		metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
		title: data?.seo?.title,
		description: seoVariant ? data?.seo?.description : data?.seo?.metaDesc,
		openGraph: {
			title: seoVariant ? data?.seo?.openGraph?.title : data?.seo?.opengraphTitle,
			description: seoVariant
				? data?.seo?.openGraph?.description
				: data?.seo?.opengraphDescription,
			images: [
				{
					url: seoVariant
						? data?.seo?.openGraph?.image?.url
						: data?.seo?.opengraphImage?.sourceUrl,
					alt: seoVariant ? data?.seo?.openGraph?.title : data?.seo?.opengraphTitle,
					width: seoVariant
						? data?.seo?.openGraph?.image?.width
						: data?.seo?.opengraphImage?.mediaDetails?.width,
					height: seoVariant
						? data?.seo?.openGraph?.image?.height
						: data?.seo?.opengraphImage?.mediaDetails?.height,
				},
			],
		},
		alternates: {
			canonical: seoVariant ? data?.seo?.canonicalUrl : data?.seo?.canonical,
		},
		robots: {
			index: robots?.[0] !== 'noindex',
			follow: robots?.[1] !== 'nofollow',
			googleBot: {
				index: robots?.[0] !== 'noindex',
				follow: robots?.[1] !== 'nofollow',
			},
		},
		keywords: seoVariant ? data?.seo?.focusKeywords : data?.seo?.focuskw,
	};
}

const Page = async ({ params }: { params: { lang: Locale } }) => {
	const { lang } = params;

	const { data, seoVariant, eventsResponse, menuProps, pages } = await getPageSettings(
		'gottsundakalendern',
		lang,
	);

	if (!data) return <Error404 />;

	const { blocks, seo, pageOptions }: any = data;

	return (
		<>
			{seoVariant && seo?.jsonLd?.raw && (
				<div dangerouslySetInnerHTML={{ __html: seo.jsonLd.raw }} />
			)}
			{!seoVariant && seo?.schema?.raw && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.schema.raw) }}
				/>
			)}
			<Header
				links={menuProps[`header-menu-${lang}`]}
				pages={pages}
				lang={lang}
				pageOptions={pageOptions?.headerBackground}
			/>
			<PageBlocks blocks={blocks} lang={lang} eventsPosts={eventsResponse} />
			<Footer links={menuProps} lang={lang} />
		</>
	);
};

export default Page;
