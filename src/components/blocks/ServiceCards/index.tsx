'use client';

import { Box, Container, Group, SimpleGrid, Text, Title } from '@mantine/core';
import React from 'react';

import CustomButton from '@/components/Button';
import Svg from '@/components/Svg';
import type { IButtonOptions, IIconOptions } from '@/helpers/global.interface';

import classes from './ServiceCards.module.css';

interface ServiceCardsProps {
	data: {
		hide_this_block: boolean;
		is_first_block: boolean;
		title: string;
		description: string;
		cards_repeater: IIconOptions[];
		button_repeater: IButtonOptions[];
	};
}

const ServiceCards: React.FC<ServiceCardsProps> = ({
	data: { is_first_block, title, description, cards_repeater, hide_this_block, button_repeater },
}) => {
	if (hide_this_block) {
		return null;
	}

	return (
		<Box className={`${classes.serviceCards} ${is_first_block ? classes.firstBlock : ''}`}>
			<Container size="xl">
				{title && (
					<Title order={3} className={classes.title}>
						{title}
					</Title>
				)}
				{description && (
					<Box
						className={classes.description}
						dangerouslySetInnerHTML={{ __html: description }}
					/>
				)}
				<SimpleGrid
					cols={{
						base: 1,
						sm: 2,
						md: 3,
						lg: cards_repeater?.length < 4 ? cards_repeater?.length : 4,
					}}
					className={`${classes.cards}`}
				>
					{(Array.isArray(cards_repeater) ? cards_repeater : [])?.map((card, key) => {
						return (
							<Box className={`${classes.card}`} key={key}>
								{card?.item_icon && (
									<Svg
										className={`${classes.icon} `}
										svg={card?.item_icon?.svg}
										style={card?.icon_color}
										width={24}
										height={24}
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
								</Box>
							</Box>
						);
					})}
				</SimpleGrid>
				{button_repeater && (
					<Group mt={24} gap={24} className={classes.buttonWrap}>
						<CustomButton button={button_repeater} />
					</Group>
				)}
			</Container>
		</Box>
	);
};

export default ServiceCards;
