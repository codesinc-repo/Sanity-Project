'use client';

import { Box, Container, Group, Image, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

import CustomButton from '@/components/Button';
import ArrowRightIcon from '@/components/Icons/ArrowRightIcon';
import { formatEventDateTime, getSortedEvents, hasDifferentEventTimes } from '@/helpers';
import type { IButtonOptions, IEventsPosts } from '@/helpers/global.interface';

import type { Locale } from '../../../../i18n-config';
import classes from './LatestEventsBlock.module.css';

interface ILatestEventsBlockProps {
	data: {
		title: string;
		subTitle: string;
		hide_this_block: boolean;
		is_first_block: boolean;
		button_repeater: IButtonOptions[];
	};
	eventsPosts: IEventsPosts;
	lang: Locale;
}

const LatestEventsBlock: FC<ILatestEventsBlockProps> = ({
	data: { title, subTitle, hide_this_block, is_first_block, button_repeater },
	eventsPosts,
	lang,
}) => {
	const sortedEvents = getSortedEvents(eventsPosts?.posts)?.slice(0, 3) || [];

	const isMobile = useMediaQuery('(max-width: 1180px)');

	if (hide_this_block) return null;

	return (
		<Box className={`${classes.latestEventsBlock} ${is_first_block ? classes.firstBlock : ''}`}>
			<Container size="xl">
				<Box className={classes.inner}>
					{title && (
						<Title order={5} className={classes.title}>
							{title}
						</Title>
					)}
					{subTitle && <Text className={classes.subTitle}>{subTitle}</Text>}
					{sortedEvents && (
						<Box className={classes.cards}>
							{(Array.isArray(sortedEvents) ? sortedEvents : []).map((item, idx) => {
								const formattedEventDate = formatEventDateTime(
									item,
									lang,
									false,
									true,
								);

								const differentEventTimes = hasDifferentEventTimes(item.events);

								return (
									<Box
										key={idx}
										className={`${classes.card} ${!idx ? classes.hovered : classes.notHovered}`}
									>
										{(!idx || isMobile) && (
											<Box className={classes.imageWrap}>
												{item.featuredImage?.node?.sourceUrl && (
													<Image
														loading={'lazy'}
														src={item.featuredImage.node.sourceUrl}
														alt={item.featuredImage.node.title}
														className={classes.cardImage}
													/>
												)}
												{isMobile && item.title && (
													<Text className={classes.cardTitle}>
														{item.title}
													</Text>
												)}
											</Box>
										)}

										<Box className={classes.cardInfoBox}>
											{!isMobile && item.title && (
												<Text className={classes.cardTitle}>
													{item.title}
												</Text>
											)}
											<Box className={classes.infoWrap}>
												{item?.location && (
													<Group className={classes.infoChildWrap}>
														{(!idx || isMobile) && (
															<Text className={classes.infoTitle}>
																{'Plats'}
															</Text>
														)}
														<Text className={classes.infoText}>
															{item?.location}
														</Text>
													</Group>
												)}
												{formattedEventDate && (
													<Group className={classes.infoChildWrap}>
														{(!idx || isMobile) && (
															<Text className={classes.infoTitle}>
																{'Datum'}
															</Text>
														)}
														<Text
															className={`${classes.infoText} ${classes.infoDate}`}
														>
															{formattedEventDate}
														</Text>
													</Group>
												)}
												{differentEventTimes ? (
													<Group className={classes.infoChildWrap}>
														{(!idx || isMobile) && (
															<Text className={classes.infoTitle}>
																{'Tid'}
															</Text>
														)}
														<Text
															className={`${classes.infoText} ${classes.varyingTimes}`}
														>
															Varierande tider
														</Text>
													</Group>
												) : (
													item?.events &&
													item?.events?.length !== 0 && (
														<Group className={classes.infoChildWrap}>
															{(!idx || isMobile) && (
																<Text className={classes.infoTitle}>
																	{'Tid'}
																</Text>
															)}
															<Text className={classes.infoText}>
																{`${item?.events[0]?.time_from} - ${item?.events[0]?.time_to}`}
															</Text>
														</Group>
													)
												)}
											</Box>
										</Box>
										<Box className={classes.cardIcon}>
											<ArrowRightIcon fill={'#F5E8B6'} />
										</Box>

										<Link
											href={`/${lang}/gottsundakalendern/event/${item.slug}`}
											className={classes.linkAbsolute}
										/>
									</Box>
								);
							})}
						</Box>
					)}
					{button_repeater && (
						<Group className={classes.buttonWrap} gap="md">
							<CustomButton button={button_repeater} />
						</Group>
					)}
				</Box>
			</Container>
		</Box>
	);
};
export default LatestEventsBlock;
