import type { Metadata } from 'next';
import React, { cache } from 'react';

import { Footer } from '@/components/Footer';
import Header from '@/components/Header';
import SingleEvent from '@/components/SingleEvent';
import { menuSettings } from '@/lib/menuSettings';
import { seoVariantEN, seoVariantSV } from '@/lib/seoVariant';
import { sitemapOptions } from '@/lib/sitemapOptions';
import { useEventBySlug } from '@/lib/useEventBySlug';

import type { Locale } from '../../../../../i18n-config';

const getPageSettings = cache(async (page: string | string[], lang: Locale) => {
	const getSeoVariant = lang === 'en' ? seoVariantEN : seoVariantSV;

	const seoVariant = await getSeoVariant();
	const [event, menuProps, pages] = await Promise.all([
		useEventBySlug(page, seoVariant),
		menuSettings(),
		sitemapOptions(),
	]);

	return {
		menuProps,
		pages,
		event,
	};
});

export async function generateMetadata({
	params,
}: {
	params: { slug: string; lang: Locale };
}): Promise<Metadata> {
	const { event } = await getPageSettings(params.slug, params.lang);

	if (!event) return {};

	return {
		metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
		title: event?.seo?.title,
		description: event?.seo?.description,
		openGraph: {
			title: event?.seo?.openGraph?.title,
			description: event?.seo?.openGraph?.description,
			images: [
				{
					url: event?.seo?.openGraph?.image?.url,
					alt: event?.seo?.openGraph?.title,
					width: event?.seo?.openGraph?.image?.width,
					height: event?.seo?.openGraph?.image?.height,
				},
			],
		},
		alternates: {
			canonical: event?.seo?.canonicalUrl,
		},
		robots: {
			index: event?.seo?.followIndex?.index,
			follow: event?.seo?.followIndex?.follow,
			googleBot: {
				index: event?.seo?.followIndex?.index,
				follow: event?.seo?.followIndex?.follow,
			},
		},
		keywords: event?.seo?.focusKeywords,
	};
}

const Page = async ({ params }: { params: { slug: string; lang: Locale } }) => {
	const { event, menuProps, pages } = await getPageSettings(params.slug, params.lang);

	return (
		<>
			{event?.seo?.jsonLd?.raw && (
				<div dangerouslySetInnerHTML={{ __html: event?.seo.jsonLd.raw }} />
			)}
			<Header
				links={menuProps[`header-menu-${params.lang}`]}
				pages={pages}
				lang={params.lang}
			/>
			<SingleEvent event={event} lang={params.lang} />
			<Footer links={menuProps} lang={params.lang} />
		</>
	);
};

export default Page;
