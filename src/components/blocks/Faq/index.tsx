'use client';

import { Box, Container, Image, SimpleGrid, Text, Title } from '@mantine/core';
import React from 'react';

import Svg from '@/components/Svg';
import type { IImage } from '@/helpers/global.interface';

import classes from './Faq.module.css';

interface Faq {
	data: {
		is_first_block: boolean;
		faq_accordion: {
			is_active_block: boolean;
			items: {
				title: string;
				days_of_the_week: string;
				time: string;
				time_icon: IImage;
			}[];
		}[];
		faq_title: string;
		image: IImage;
		hide_this_block: string;
	};
}

const FaqBlock = ({
	data: { faq_title, image, faq_accordion, hide_this_block, is_first_block },
}: Faq) => {
	if (hide_this_block) {
		return null;
	}

	return (
		<Box className={`${classes.faq} ${is_first_block ? classes.firstBlock : ''}`}>
			<Container size="xl">
				{faq_title && (
					<Title order={2} className={classes.title}>
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
					<Box className={classes.content}>
						{(Array.isArray(faq_accordion) ? faq_accordion : [])?.map(
							(accordion, index) => {
								return (
									<Box
										key={index}
										className={`${classes.accordion} ${accordion?.is_active_block ? classes.activeAccordion : ''}`}
									>
										{(Array.isArray(accordion?.items)
											? accordion?.items
											: []
										)?.map((item, idx) => {
											return (
												<Box key={idx} className={classes.item}>
													<Text className={classes.itemText}>
														{item?.title}
													</Text>
													<Box className={classes.itemInfoWrap}>
														<Text className={classes.itemText}>
															{item?.days_of_the_week}
														</Text>
														<Box className={classes.itemTimeWrap}>
															<Svg
																width={20}
																height={20}
																svg={item?.time_icon?.svg}
																className={classes.itemIcon}
															/>
															<Text className={classes.itemText}>
																{item?.time}
															</Text>
														</Box>
													</Box>
												</Box>
											);
										})}
									</Box>
								);
							},
						)}
					</Box>
					{image && (
						<Image
							src={image?.url}
							alt={image?.title}
							className={`${classes.image}`}
							loading={'lazy'}
						/>
					)}
				</SimpleGrid>
			</Container>
		</Box>
	);
};

export default FaqBlock;
