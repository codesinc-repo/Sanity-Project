'use client';

import { Box, Container, Image, SimpleGrid, Text, Title } from '@mantine/core';
import React from 'react';

import type { IImage } from '@/helpers/global.interface';

import classes from './MenuBlock.module.css';

interface MenuBlockProps {
	data: {
		hide_this_block: boolean;
		is_first_block: boolean;
		title: string;
		cards_repeater: {
			item_icon: IImage;
			item_text: string;
			item_desc: string;
			price: string;
		}[];
	};
}

const MenuBlock: React.FC<MenuBlockProps> = ({
	data: { is_first_block, title, cards_repeater, hide_this_block },
}) => {
	if (hide_this_block) {
		return null;
	}

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
						md: 2,
					}}
					className={`${classes.cards}`}
				>
					{(Array.isArray(cards_repeater) ? cards_repeater : [])?.map((card, key) => {
						return (
							<Box className={`${classes.card}`} key={key}>
								{card?.item_icon && (
									<Image
										loading={'lazy'}
										className={`${classes.cardImage}`}
										src={card?.item_icon?.url}
										alt={card?.item_icon?.title}
									/>
								)}
								<Box>
									{card?.item_text && (
										<Text className={classes.cardTitle}>{card.item_text}</Text>
									)}
									{card?.item_desc && (
										<Text className={classes.cardDescription}>
											{card.item_desc}
										</Text>
									)}
									{card?.price && (
										<Text className={classes.cardPrice}>{card.price}</Text>
									)}
								</Box>
							</Box>
						);
					})}
				</SimpleGrid>
			</Container>
		</Box>
	);
};

export default MenuBlock;
