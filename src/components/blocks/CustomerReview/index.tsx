'use client';

import { Box, Container, Group, Image, SimpleGrid, Title } from '@mantine/core';
import React, { memo, useEffect, useState } from 'react';

import CustomButton from '@/components/Button';
import { addTargetSvg } from '@/helpers';
import type { IButtonOptions, IImage } from '@/helpers/global.interface';

import classes from './CustomerReview.module.css';

interface CustomerReviewProps {
	data: {
		hide_this_block: boolean;
		is_first_block: boolean;
		text_color: string;
		block_with_background_image: boolean;
		is_absolute_image: boolean;
		background_color: string;
		title: string;
		description: string;
		image: IImage;
		button_repeater: IButtonOptions[];
	};
}

const CustomerReview: React.FC<CustomerReviewProps> = ({
	data: {
		hide_this_block,
		text_color,
		block_with_background_image,
		background_color,
		is_absolute_image,
		title,
		description,
		image,
		button_repeater,
		is_first_block,
	},
}) => {
	if (hide_this_block) {
		return null;
	}

	const blockWithBg = block_with_background_image ? classes.withBg : '';
	const blockWithAbsoluteImage = is_absolute_image ? classes.withAbsoluteImage : '';
	const firstBlockClass = is_first_block ? classes.firstBlock : '';

	const [processedHtml, setProcessedHtml] = useState<string>(description);

	useEffect(() => {
		setProcessedHtml(addTargetSvg(description, text_color));
	}, [description]);

	return (
		<Box
			className={`${classes.customerReview} ${blockWithBg} ${firstBlockClass} ${blockWithAbsoluteImage}`}
		>
			<Container size="xl">
				<SimpleGrid
					cols={{
						base: 1,
						sm: 1,
						md: 2,
					}}
					spacing={{
						base: 0,
					}}
					style={{
						backgroundColor: background_color,
						color: text_color,
					}}
					className={classes.inner}
				>
					<Box className={classes.content}>
						{title && (
							<Title
								order={3}
								className={classes.title}
								dangerouslySetInnerHTML={{ __html: title }}
							/>
						)}
						{processedHtml && (
							<Box
								className={classes.description}
								dangerouslySetInnerHTML={{ __html: processedHtml }}
							/>
						)}

						{button_repeater && (
							<Group className={classes.buttonWrap} gap={16}>
								<CustomButton button={button_repeater} />
							</Group>
						)}
					</Box>

					{!is_absolute_image && image && (
						<Image
							loading={'lazy'}
							src={image?.url}
							alt={image?.title}
							className={
								block_with_background_image ? classes.image : classes.imageMask
							}
						/>
					)}
					{is_absolute_image && image && (
						<Image
							loading={'lazy'}
							src={image?.url}
							alt={image?.title}
							className={classes.imageAbsolute}
						/>
					)}
				</SimpleGrid>
			</Container>
		</Box>
	);
};

export default memo(CustomerReview);
