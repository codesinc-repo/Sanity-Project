'use client';

import { Box, Container, Image, SimpleGrid, Text, Title } from '@mantine/core';
import Link from 'next/link';
import React from 'react';

import type { IButton, IImage } from '@/helpers/global.interface';

import classes from './TeamBlock.module.css';

interface ITeamBlockProps {
	data: {
		is_first_block: boolean;
		hide_this_block: boolean;
		block_column: boolean;
		title_position: boolean;
		title: string;
		sub_title: string;
		team: {
			item_icon: IImage;
			name: string;
			position: string;
			email: IButton;
			phone: IButton;
		}[];
	};
}

const TeamBlock: React.FC<ITeamBlockProps> = ({
	data: { is_first_block, title, team, hide_this_block, block_column, title_position, sub_title },
}) => {
	if (hide_this_block) {
		return null;
	}

	const position = title_position ? classes.center : '';
	const positionText = title_position ? classes.centerText : '';

	return (
		<Box className={`${classes.teamBlock} ${is_first_block ? classes.firstBlock : ''}`}>
			<Container size="xl">
				<Box className={`${classes.titleWrap} ${position}`}>
					{title && (
						<Title order={5} className={`${classes.title} ${positionText}`}>
							{title}
						</Title>
					)}
					{sub_title && (
						<Text className={`${classes.subTitle} ${positionText}`}>{sub_title}</Text>
					)}
				</Box>
				<SimpleGrid
					cols={{
						base: 1,
						sm: 2,
						lg: block_column ? 3 : 2,
					}}
					className={`${classes.cards}`}
				>
					{(Array.isArray(team) ? team : [])?.map((card, key) => {
						return (
							<Box className={`${classes.card}`} key={key}>
								{card?.item_icon && (
									<Image
										loading={'lazy'}
										className={classes.cardImage}
										src={card?.item_icon?.url}
										alt={card?.item_icon?.title}
									/>
								)}
								<Box className={`${classes.cardContent}`}>
									<Box>
										{card?.name && (
											<Text className={classes.cardTitle}>{card.name}</Text>
										)}
										{card?.position && (
											<Text className={classes.cardDescription}>
												{card.position}
											</Text>
										)}
									</Box>
									<Box>
										{card?.email?.url && (
											<Link
												className={classes.cardLink}
												href={card?.email?.url}
											>
												{card?.email?.title}
											</Link>
										)}
										{card?.phone?.url && (
											<Link
												className={classes.cardLink}
												href={card?.phone?.url}
											>
												{card?.phone?.title}
											</Link>
										)}
									</Box>
								</Box>
							</Box>
						);
					})}
				</SimpleGrid>
			</Container>
		</Box>
	);
};

export default TeamBlock;
