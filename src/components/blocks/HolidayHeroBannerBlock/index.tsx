'use client';

import { Box, Container, Title } from '@mantine/core';
import React, { useEffect, useState } from 'react';

import IconHolidaySnow from '@/components/Icons/IconHolidaySnow';
import IconTreeBig from '@/components/Icons/IconTreeBig';
import IconTreeSmall from '@/components/Icons/IconTreeSmall';
import SnowBlock from '@/components/SnowBlock';
import { addTargetSvg } from '@/helpers';

import classes from './HolidayHeroBannerBlock.module.css';

interface HolidayHeroBannerBlockProps {
	data: {
		desc: string;
		title: string;
		holiday_name: string;
		hide_this_block: boolean;
		show_animation: boolean;
		background_color: string;
		holiday_texts: { item_text: string }[];
	};
}

const HolidayHeroBannerBlock = ({
	data: {
		title,
		holiday_name,
		desc,
		hide_this_block,
		show_animation,
		holiday_texts,
		background_color,
	},
}: HolidayHeroBannerBlockProps) => {
	if (hide_this_block) return null;

	const [processedHtml, setProcessedHtml] = useState<string>(desc);

	const currentDay = new Date().getDate();

	const mainText = holiday_texts[currentDay - 1]?.item_text || '';

	useEffect(() => {
		setProcessedHtml(addTargetSvg(desc, '#FFEBB4'));
	}, [desc]);

	return (
		<Box
			className={classes.holidayHeroBanner}
			style={{ backgroundColor: background_color }}
			data-block={'holiday'}
		>
			<Container className={classes.heroBannerContainer} size="xl">
				<Box className={classes.content}>
					{title && (
						<Title order={3} className={classes.title}>
							{title}
						</Title>
					)}
					{holiday_name && (
						<Title order={4} className={classes.subTitle}>
							{`${holiday_name} ${currentDay}`}
						</Title>
					)}
					{mainText && (
						<Title order={2} className={classes.mainText}>
							{mainText}
						</Title>
					)}
					{processedHtml && (
						<Box
							className={classes.description}
							dangerouslySetInnerHTML={{ __html: processedHtml }}
						/>
					)}
				</Box>
				{show_animation && <SnowBlock />}
			</Container>
			<IconHolidaySnow className={classes.snow} />
			<IconTreeBig className={classes.treeBig} />
			<IconTreeSmall className={classes.treeSmall} />
		</Box>
	);
};

export default React.memo(HolidayHeroBannerBlock);
