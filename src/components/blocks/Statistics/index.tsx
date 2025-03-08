'use client';

import { Box, Container, Group, SimpleGrid, Text, Title } from '@mantine/core';
import React from 'react';

import CustomButton from '@/components/Button';
import type { IButtonOptions } from '@/helpers/global.interface';

import classes from './Statistics.module.css';

interface StatisticsProps {
	data: {
		button_repeater: IButtonOptions[];
		title: string;
		hide_this_block: boolean;
		cards: {
			title: string;
			small_text_after_title: string;
			sub_title: string;
			description: string;
		}[];
	};
}

const Statistics: React.FC<StatisticsProps> = ({
	data: {
		title,

		button_repeater,

		hide_this_block,

		cards,
	},
}) => {
	if (hide_this_block) {
		return null;
	}
	return (
		<Box className={`${classes.statistics}`}>
			<Container size="xl">
				{title && (
					<Title order={5} className={classes.title}>
						{title}
					</Title>
				)}
				{cards && (
					<SimpleGrid
						cols={{
							base: 1,
							sm: 2,
							md: 3,
						}}
						spacing={{
							base: 16,
							sm: 24,
						}}
						className={`${classes.cards}`}
					>
						{(Array.isArray(cards) ? cards : [])?.map((card, idx) => {
							return (
								<Box key={idx} className={`${classes.card}`}>
									<Box className={classes.cardTitleWrap}>
										{card?.title && (
											<Title order={3} className={`${classes.cardTitle}`}>
												{card?.title}
											</Title>
										)}
										{card?.small_text_after_title && (
											<Title
												order={3}
												className={`${classes.cardSmallTitle}`}
											>
												{card?.small_text_after_title}
											</Title>
										)}
									</Box>
									{card?.sub_title && (
										<Text className={`${classes.cardSubTitle}`}>
											{card?.sub_title}
										</Text>
									)}
									{card?.description && (
										<Text className={`${classes.cardDescription}`}>
											{card?.description}
										</Text>
									)}
								</Box>
							);
						})}
					</SimpleGrid>
				)}
				{button_repeater && (
					<Group className={classes.buttonWrap} gap={'md'}>
						<CustomButton button={button_repeater} />
					</Group>
				)}
			</Container>
		</Box>
	);
};

export default Statistics;
