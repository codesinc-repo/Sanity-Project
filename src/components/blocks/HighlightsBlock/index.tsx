'use client';

import { Box, Container, Image, SimpleGrid, Title } from '@mantine/core';
import Link from 'next/link';
import React, { useMemo } from 'react';

import type { IIconOptions } from '@/helpers/global.interface';

import Svg from '../../Svg';
import classes from './HighlightsBlock.module.css';

interface HighlightsBlockProps {
	data: {
		hide_this_block: boolean;
		is_first_block: boolean;
		title: string;
		cards_repeater: IIconOptions[];
	};
}

const HighlightsBlock: React.FC<HighlightsBlockProps> = ({
	data: { title, cards_repeater, hide_this_block, is_first_block },
}) => {
	if (hide_this_block) {
		return null;
	}

	const cardElements = useMemo(() => {
		return (Array.isArray(cards_repeater) ? cards_repeater : []).map((card, key) => (
			<Box
				className={classes.card}
				key={key}
				style={{ backgroundColor: card?.background_color }}
			>
				{card?.item_icon && (
					<Svg
						className={classes.icon}
						svg={card?.item_icon?.svg}
						style={card?.icon_color}
						width={32}
						height={32}
					/>
				)}
				{card?.item_text && (
					<Title
						order={4}
						className={classes.cardTitle}
						style={{ color: card?.text_color }}
					>
						{card.item_text}
					</Title>
				)}
				{card?.item_link?.url && (
					<Link className={classes.cardLink} href={card.item_link.url} />
				)}
				{card?.image?.url && (
					<Image
						src={card.image.url}
						alt={card.image.title}
						className={classes.image}
						loading={'lazy'}
					/>
				)}
			</Box>
		));
	}, [cards_repeater]);

	return (
		<Box className={`${classes.highlightsBlock} ${is_first_block ? classes.firstBlock : ''}`}>
			<Container size="xl">
				{title && (
					<Title order={3} className={classes.title}>
						{title}
					</Title>
				)}
				<SimpleGrid
					cols={{
						base: 1,
						sm: 2,
						lg: 3,
					}}
					className={classes.cards}
				>
					{cardElements}
				</SimpleGrid>
			</Container>
		</Box>
	);
};

export default HighlightsBlock;
