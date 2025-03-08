'use client';

import { Box, Container, Group, Image, SimpleGrid, Text, Title } from '@mantine/core';
import axios from 'axios';
import Link from 'next/link';
import type { FC } from 'react';
import React, { useState } from 'react';

import IconLoading from '@/components/Icons/IconLoading';
import IconLogout from '@/components/Icons/IconLogout';
import { formatEventDateTime, getSortedEvents, hasDifferentEventTimes } from '@/helpers';
import type { IEventsPosts, ILink } from '@/helpers/global.interface';

import type { Locale } from '../../../../i18n-config';
import classes from './EventsBlock.module.css';

interface IEventsBlockProps {
	data: {
		title: string;
		subTitle: string;
		link: ILink;
	};
	eventsPosts: IEventsPosts;
	lang: Locale;
}

const EventsBlock: FC<IEventsBlockProps> = ({
	data: { title, subTitle, link },
	eventsPosts,
	lang,
}) => {
	const [eventsData, setEventsData] = useState<IEventsPosts | null>(eventsPosts);
	const [visibleEventsCount, setVisibleEventsCount] = useState<number>(9);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [loading, setLoading] = useState(false);

	const sortedEvents = getSortedEvents(eventsData?.posts);

	const handleLoadMore = async () => {
		setLoading(true);
		try {
			const nextPage = currentPage + 1;

			const { data } = await axios.get('/api/get-events', {
				params: { lang, per_page: 9, page: nextPage },
			});

			if (data.posts.length > 0) {
				setEventsData((prev) => ({
					...data,
					posts: [
						...(prev?.posts || []),
						...data.posts.slice(0, data.totalCount - (prev?.posts.length || 0)),
					],
				}));

				setCurrentPage(nextPage);
				setVisibleEventsCount((prevCount) => prevCount + 9);
				setLoading(false);
			}
		} catch (error) {
			setLoading(false);
			console.error(error);
		}
	};

	return (
		<Box className={classes.eventsBlock}>
			<Container size="xl">
				<Group className={classes.titleWrap}>
					{title && (
						<Title order={5} className={classes.title}>
							{title}
						</Title>
					)}
					<Group className={classes.linksWrap}>
						{link && (
							<Link
								href={`/${lang}${link.url}`}
								target={link.target}
								className={classes.openCalendarWrap}
							>
								<IconLogout />
								<span className={classes.openCalendar}>{link.title}</span>
							</Link>
						)}
						<Link href={`/${lang}/gottsundakalendern/information/`} className={classes.moreInfo}>
							{'Mer information'}
						</Link>
					</Group>
				</Group>

				{subTitle && <Text className={classes.subTitle}>{subTitle}</Text>}

				{sortedEvents && (
					<SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }} className={classes.cards}>
						{(Array.isArray(sortedEvents)
							? sortedEvents.slice(0, visibleEventsCount)
							: []
						)?.map((item, idx) => {
							const formattedEventDate = formatEventDateTime(item, lang, false, true);

							const differentEventTimes = hasDifferentEventTimes(item.events);

							return (
								<Box key={idx} className={classes.blogCard}>
									{item.featuredImage?.node?.sourceUrl && (
										<Box className={classes.imageWrap}>
											<Image
												loading={'lazy'}
												src={item.featuredImage.node.sourceUrl}
												alt={item.featuredImage.node.title}
												className={classes.blogCardImage}
												style={{
													objectFit:
														item.featuredImage.node.sourceUrl.includes(
															'logo',
														)
															? 'contain'
															: 'cover',
												}}
											/>
											<Group className={classes.categoriesWrap} gap={8}>
												{(Array.isArray(item.categories)
													? item.categories
													: []
												).map((cat, index) => (
													<Text
														key={index}
														className={classes.blogCardCategory}
													>
														{cat.name}
													</Text>
												))}
											</Group>
										</Box>
									)}
									{item.title && (
										<Text className={classes.blogCardTitle}>{item.title}</Text>
									)}
									<Box className={classes.infoWrap}>
										{item?.location && (
											<Group className={classes.infoChildWrap}>
												<Text className={classes.infoTitle}>{'Plats'}</Text>
												<Text className={classes.infoText}>
													{item?.location}
												</Text>
											</Group>
										)}
										{formattedEventDate && (
											<Group className={classes.infoChildWrap}>
												<Text className={classes.infoTitle}>{'Datum'}</Text>
												<Text
													className={`${classes.infoText} ${classes.infoDate}`}
												>
													{formattedEventDate}
												</Text>
											</Group>
										)}
										{differentEventTimes ? (
											<Group className={classes.infoChildWrap}>
												<Text className={classes.infoTitle}>{'Tid'}</Text>
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
													<Text className={classes.infoTitle}>
														{'Tid'}
													</Text>
													<Text className={classes.infoText}>
														{`${item?.events[0]?.time_from} - ${item?.events[0]?.time_to}`}
													</Text>
												</Group>
											)
										)}
									</Box>

									<Text className={classes.cardBtn}>{'Till aktiviteten'}</Text>

									<Link
										href={`/${lang}/gottsundakalendern/event/${item.slug}`}
										className={classes.linkAbsolute}
									/>
								</Box>
							);
						})}
					</SimpleGrid>
				)}

				{visibleEventsCount < (sortedEvents.length || 0) && (
					<Text onClick={handleLoadMore} className={classes.loadMore}>
						{loading ? <IconLoading /> : 'Ladda fler'}
					</Text>
				)}
			</Container>
		</Box>
	);
};

export default EventsBlock;
