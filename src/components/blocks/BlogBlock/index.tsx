import type { FC } from 'react';
import React from 'react';

import { postSettings } from '@/lib/postByIdSettings';
import { seoVariantEN, seoVariantSV } from '@/lib/seoVariant';

import type { Locale } from '../../../../i18n-config';
import BlogComponent from './BlogComponent';

interface IBlogProps {
	data: {
		hide_this_block: string;
		title: string;
		sub_title: string;
		posts: number[];
	};
	lang: Locale;
}

const BlogBlock: FC<IBlogProps> = async ({
	data: { hide_this_block, title, sub_title, posts },
	lang,
}) => {
	if (hide_this_block || !posts) {
		return null;
	}
	const seoVariants = {
		en: seoVariantEN,
		sv: seoVariantSV,
	};
	const seoVariant = await (seoVariants[lang] || seoVariantEN)();

	const postsResponse = await Promise.all(
		(Array.isArray(posts) ? posts : []).map(async (post) => postSettings(post, seoVariant)),
	);

	return <BlogComponent title={title} subTitle={sub_title} posts={postsResponse} />;
};

export default BlogBlock;
