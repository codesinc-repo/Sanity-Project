'use client';

import { Box, Container, Image, SimpleGrid, Text, Title } from '@mantine/core';
import Link from 'next/link';
import React from 'react';

import ArrowRightIcon from '@/components/Icons/ArrowRightIcon';
import type { IButton, IImage } from '@/helpers/global.interface';

import classes from './ActivitiesBlock.module.css';

interface ActivitiesBlockProps {
	data: {
		hide_this_block: boolean;
		is_first_block: boolean;
		title: string;
		cards_repeater: {
			image: IImage;
			link: IButton;
		}[];
	};
}

const ActivitiesBlock: React.FC<ActivitiesBlockProps> = ({
	data: { title, cards_repeater, hide_this_block, is_first_block },
}) => {
	if (hide_this_block) return null;

	return (
		<Box className={`${classes.serviceCards} ${is_first_block ? classes.firstBlock : ''}`}>
			<Container size="xl">
				{title && (
					<Title order={5} className={classes.title}>
						{title}
					</Title>
				)}
				<SimpleGrid
					cols={{
						base: 1,
						sm: 2,
						md: 3,
					}}
					className={classes.cards}
				>
					{(Array.isArray(cards_repeater) ? cards_repeater : [])?.map(
						({ image, link }, key) => (
							<Box className={classes.card} key={key}>
								{image?.url && (
									<Image
										loading={'lazy'}
										src={image.url}
										alt={image.title || 'Image'}
										className={classes.cardImage}
									/>
								)}
								<Box className={classes.cardTitleWrap}>
									{link?.title && (
										<Text className={classes.cardTitle}>{link.title}</Text>
									)}
									<Box className={classes.iconWrap}>
										<ArrowRightIcon fill="black" />
									</Box>
								</Box>
								{link?.url && <Link href={link.url} className={classes.cardLink} />}
							</Box>
						),
					)}
				</SimpleGrid>
			</Container>
		</Box>
	);
};

export default React.memo(ActivitiesBlock);
