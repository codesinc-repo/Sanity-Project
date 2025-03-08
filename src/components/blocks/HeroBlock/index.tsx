'use client';

import { Box, Container, Group, Image, SimpleGrid, Text, Title } from '@mantine/core';
import React, { useEffect, useState } from 'react';

import CustomButton from '@/components/Button';
import { addTargetSvg } from '@/helpers';
import type { IButtonOptions, IImage } from '@/helpers/global.interface';

import classes from './Hero.module.css';

interface HeroProps {
	data: {
		button_repeater: IButtonOptions[];
		desc: string;
		title: string;
		sub_title: string;
		sub_title_color: string;
		background_color: string;
		block_text_color: string;
		text_color: string;
		image: IImage;
		hide_this_block: boolean;
		is_first_block: boolean;
		block_background_color: string;
		block_content_with_bg: boolean;
		image_with_mask: boolean;
		block_format: boolean;
		picture_position: boolean;
		cards_position: boolean;
		block_grid: boolean;
		cards: {
			title: string;
			small_text_after_title: string;
			sub_title: string;
			description: string;
		}[];
	};
}

const Hero: React.FC<HeroProps> = ({ data }) => {
	const {
		title,
		sub_title,
		sub_title_color,
		image_with_mask,
		desc,
		button_repeater,
		image,
		hide_this_block,
		picture_position,
		block_format,
		cards_position,
		block_grid,
		background_color,
		text_color,
		cards,
		block_content_with_bg,
		is_first_block,
		block_background_color,
		block_text_color,
	} = data;

	if (hide_this_block) return null;

	const imagePosition = picture_position ? classes.position : '';
	const cardsPosition = cards_position ? classes.position : '';
	const position = block_format ? cardsPosition : imagePosition;

	const [processedHtml, setProcessedHtml] = useState<string>(desc);

	useEffect(() => {
		setProcessedHtml(addTargetSvg(desc, block_text_color));
	}, [desc]);

	const renderTitle = title && (
		<Title order={is_first_block ? 2 : 3} className={classes.title}>
			{title}
		</Title>
	);

	const renderSubTitle = sub_title && (
		<Text className={classes.subTitle} style={{ color: sub_title_color }}>
			{sub_title}
		</Text>
	);

	const renderDescription = processedHtml && (
		<Box className={classes.desc} dangerouslySetInnerHTML={{ __html: processedHtml }} />
	);

	const renderButtons = button_repeater && (
		<Group className={classes.buttonWrap} gap="md">
			<CustomButton button={button_repeater} />
		</Group>
	);

	const renderCards = cards && block_format && (
		<SimpleGrid
			cols={{ base: 1, sm: 1, md: 2 }}
			spacing={{ base: 16, sm: 24 }}
			className={classes.cards}
		>
			{(Array.isArray(cards) ? cards : []).map((card, idx) => (
				<Box key={idx} className={classes.card}>
					<Box className={classes.cardTitleWrap}>
						{card.title && (
							<Title order={3} className={classes.cardTitle}>
								{card.title}
							</Title>
						)}
						{card.small_text_after_title && (
							<Title order={3} className={classes.cardSmallTitle}>
								{card.small_text_after_title}
							</Title>
						)}
					</Box>
					{card.sub_title && (
						<Text className={classes.cardSubTitle}>{card.sub_title}</Text>
					)}
					{card.description && (
						<Text className={classes.cardDescription}>{card.description}</Text>
					)}
				</Box>
			))}
		</SimpleGrid>
	);

	return (
		<Box
			className={`${classes.hero} ${is_first_block ? classes.firstBlock : ''}`}
			style={{ backgroundColor: block_background_color, color: block_text_color }}
		>
			<Container size="xl">
				<SimpleGrid
					cols={{ base: 1, sm: 1, md: 2 }}
					className={`${position} ${classes.inner} ${block_grid ? classes.blockGrid : ''} ${block_content_with_bg ? classes.withBgWrap : ''}`}
				>
					<Box
						className={`${classes.content} ${block_content_with_bg ? classes.withBg : ''}`}
						style={{ backgroundColor: background_color, color: text_color }}
					>
						{renderTitle}
						{renderSubTitle}
						{renderDescription}
						{renderButtons}
					</Box>
					{image && !block_format && (
						<Image
							src={image?.url}
							alt={image?.title}
							loading="lazy"
							className={image_with_mask ? classes.imageMask : classes.image}
						/>
					)}
					{renderCards}
				</SimpleGrid>
			</Container>
		</Box>
	);
};

export default React.memo(Hero);
