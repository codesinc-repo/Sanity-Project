'use client';

import { Box, Container, SimpleGrid, Text, Title } from '@mantine/core';
import React from 'react';

import classes from './SustainabilityPromise.module.css';

interface SustainabilityPromiseProps {
	data: {
		hide_this_block: boolean;
		is_first_block: boolean;
		title: string;
		cards: {
			item_text: string;
			items: {
				title: string;
				description: string;
			}[];
		}[];
	};
}

const SustainabilityPromise: React.FC<SustainabilityPromiseProps> = ({
	data: { is_first_block, title, hide_this_block, cards },
}) => {
	if (hide_this_block) {
		return null;
	}

	return (
		<Box className={`${classes.serviceCards} ${is_first_block ? classes.firstBlock : ''}`}>
			<Container size="xl">
				{title && (
					<Title order={4} className={classes.title}>
						{title}
					</Title>
				)}
				<SimpleGrid
					cols={{
						base: 1,
						sm: 2,
						md: 3,
					}}
					className={`${classes.cards}`}
				>
					{(Array.isArray(cards) ? cards : [])?.map((card, key) => {
						return (
							<Box className={`${classes.card}`} key={key}>
								{card?.item_text && (
									<Title order={5} className={classes.cardTitle}>
										{card?.item_text}
									</Title>
								)}
								<Box className={`${classes.items}`}>
									{(Array.isArray(card.items) ? card.items : [])?.map(
										(item, idx) => {
											return (
												<Box key={idx} className={`${classes.item}`}>
													<Text className={`${classes.itemTitle}`}>
														{item?.title}
													</Text>
													<Text className={`${classes.itemDesc}`}>
														{item?.description}
													</Text>
												</Box>
											);
										},
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

export default SustainabilityPromise;
