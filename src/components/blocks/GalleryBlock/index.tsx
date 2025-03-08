'use client';

import { Box, Container, Image, SimpleGrid, Text, Title } from '@mantine/core';
import React from 'react';

import InstagramIcon from '@/components/Icons/InstagramIcon';
import type { IImage } from '@/helpers/global.interface';

import classes from './GalleryBlock.module.css';

interface IGalleryBlockProps {
	data: {
		title: string;
		first_block_text: string;
		gallery: {
			image: IImage;
		}[];
		hide_this_block: string;
		is_first_block: boolean;
	};
}

const GalleryBlock: React.FC<IGalleryBlockProps> = ({
	data: { gallery, hide_this_block, title, first_block_text, is_first_block },
}) => {
	if (hide_this_block) {
		return null;
	}

	const firstBlockClass = is_first_block ? classes.firstBlock : '';

	return (
		<Box className={`${classes.galleryBlock} ${firstBlockClass}`}>
			<Container size="xl">
				{title && (
					<Title order={5} mb={24} className={classes.title}>
						{title}
					</Title>
				)}

				{gallery && (
					<SimpleGrid
						cols={{
							base: 1,
							md: 2,
						}}
						spacing={{
							base: 24,
						}}
						className={classes.inner}
					>
						<Box className={classes.imageWrap}>
							<Box className={classes.imageTextWrap}>
								{first_block_text && (
									<Text className={classes.imageText}>{first_block_text}</Text>
								)}
								<InstagramIcon />
							</Box>
							<Image
								src={gallery[0]?.image?.url}
								className={classes.colFirst}
								alt={gallery[0]?.image?.title}
								loading={'lazy'}
							/>
						</Box>

						<SimpleGrid
							cols={{
								base: 2,
							}}
							spacing={{
								base: 16,
								md: 24,
							}}
							className={classes.inner}
						>
							{(Array.isArray(gallery) ? gallery.slice(1, 5) : [])?.map(
								(item, idx) => (
									<Box className={classes.imageWrap} key={idx}>
										<Image
											loading={'lazy'}
											className={classes.col}
											src={item?.image?.url}
											alt={item?.image?.title}
										/>
									</Box>
								),
							)}
						</SimpleGrid>
					</SimpleGrid>
				)}
			</Container>
		</Box>
	);
};

export default React.memo(GalleryBlock);
