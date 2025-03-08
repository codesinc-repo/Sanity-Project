'use client';

import { Box, Container, SimpleGrid, Text, Title } from '@mantine/core';
import React from 'react';

import classes from './OpeningHours.module.css';

interface OpeningHours {
	data: {
		cards: {
			items: {
				title: string;
				time: string;
			}[];
		}[];
		faq_title: string;
		hide_this_block: string;
		is_first_block: boolean;
	};
}

const parseDate = (dateString: string): Date | null => {
	const monthMap: Record<string, number> = {
		januari: 0,
		februari: 1,
		mars: 2,
		april: 3,
		maj: 4,
		juni: 5,
		juli: 6,
		augusti: 7,
		september: 8,
		oktober: 9,
		november: 10,
		december: 11,
	};

	const [, day, month, year] = dateString.split(' ');

	const monthIndex = monthMap[month?.toLowerCase() || ''];
	if (monthIndex === undefined) return null;

	return new Date(Number(year), monthIndex, Number(day));
};

const OpeningHoursBlock = ({
	data: { is_first_block, faq_title, cards, hide_this_block },
}: OpeningHours) => {
	if (hide_this_block) {
		return null;
	}

	const filteredCards = cards?.filter(({ items }) => {
		const firstItemDate = parseDate(items?.[0]?.time || '');
		return !firstItemDate || firstItemDate >= new Date();
	});

	return (
		<div className={`${classes.openingHours} ${is_first_block ? classes.firstBlock : ''}`}>
			<Container size="xl">
				{faq_title && (
					<Title order={4} className={classes.title}>
						{faq_title}
					</Title>
				)}
				<SimpleGrid
					className={classes.inner}
					cols={{
						base: 1,
						md: 2,
					}}
					spacing={{
						base: 24,
					}}
				>
					{(Array.isArray(filteredCards) ? filteredCards : [])?.map((card, index) => {
						return (
							<Box key={index} className={`${classes.card}`}>
								{(Array.isArray(card?.items) ? card?.items : [])?.map(
									(item, idx) => {
										return (
											<Box key={idx} className={classes.item}>
												<Text className={classes.itemText}>
													{item?.title}
												</Text>
												<Text className={classes.itemText}>
													{item?.time}
												</Text>
											</Box>
										);
									},
								)}
							</Box>
						);
					})}
				</SimpleGrid>
			</Container>
		</div>
	);
};

export default OpeningHoursBlock;
