'use client';

import { Box, Container, Group, Image, SimpleGrid, Text, Title } from '@mantine/core';
import Link from 'next/link';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import IconCopy from '@/components/Icons/IconCopy';
import IconFacebook from '@/components/Icons/IconFacebook';
import IconLinkedin from '@/components/Icons/IconLinkedin';
import classes from '@/components/SingleEvent/SingleEvent.module.css';
import { formatedLastEventDate, formatedRecurringEvent, groupEventsByTime } from '@/helpers';
import type { IEventData } from '@/helpers/global.interface';

import type { Locale } from '../../../i18n-config';

interface ISingleEventProps {
	event: IEventData;
	lang: Locale;
}

const SingleEvent: FC<ISingleEventProps> = ({ event }) => {
	if (!event) return null;

	const groupEventsByTimeData = event && groupEventsByTime(event);

	const [currentUrl, setCurrentUrl] = useState('');

	useEffect(() => {
		setCurrentUrl(window.location.href);
	}, []);

	// Function to copy the current URL to the clipboard
	const copyLink = async () => {
		try {
			await navigator.clipboard.writeText(currentUrl);
			alert('Länken har kopierats!');
		} catch (err) {
			console.error('Failed to copy link:', err);
		}
	};

	return (
		<Box className={`${classes.singleEvent} `}>
			<Container size={'xl'}>
				<Group className={classes.contentWrap}>
					<SimpleGrid className={classes.content}>
						<Group className={classes.infoWrap}>
							<Group className={classes.boxDateWrap}>
								<Text className={classes.label}>Datum och tid</Text>
								{(Array.isArray(groupEventsByTimeData)
									? groupEventsByTimeData
									: []
								)?.map((item, idx) => {
									return (
										<Group key={idx} className={classes.boxDate}>
											<Group className={classes.dataWrap}>
												<Text className={classes.dateText}>
													{item?.dateRange}
												</Text>
												<Text className={classes.dateText}>
													{item?.timeRange}
												</Text>
											</Group>
										</Group>
									);
								})}
							</Group>
							{event?.recurring_event !== 'aldrig' && (
								<Group className={classes.boxDateWrap}>
									<Text className={classes.label}>Intervall</Text>
									<Text className={classes.dateText}>
										{formatedRecurringEvent(event?.recurring_event)}
									</Text>
								</Group>
							)}
							{event?.ending !== 'aldrig' && (
								<Group className={classes.boxDateWrap}>
									<Text className={classes.label}>Sista eventdatum</Text>
									<Text className={classes.dateText}>
										{formatedLastEventDate(
											event?.events,
											event?.ending_date,
											event?.number_of_repetitions,
											event?.recurring_event,
										)}
									</Text>
								</Group>
							)}
							{event?.location && (
								<Group className={classes.boxDateWrap}>
									<Text className={classes.label}>Arrangör</Text>
									<Text className={classes.dateText}>{event?.location}</Text>
								</Group>
							)}
							{event?.address && (
								<Group className={classes.boxDateWrap}>
									<Text className={classes.label}>Plats</Text>
									<Text className={classes.dateText}>{event?.address}</Text>
								</Group>
							)}
							{event?.organiser && (
								<Group className={classes.boxDateWrap}>
									<Text className={classes.label}>Ansvarig person</Text>
									<Text className={classes.dateText}>{event?.organiser}</Text>
								</Group>
							)}
							{event?.phone && (
								<Group className={classes.boxDateWrap}>
									<Text className={classes.label}>Telefonnummer</Text>
									<Text className={classes.dateText}>{event?.phone}</Text>
								</Group>
							)}
							{event?.email && (
								<Group className={classes.boxDateWrap}>
									<Text className={classes.label}>E-mail</Text>
									<Text className={classes.dateText}>{event?.email}</Text>
								</Group>
							)}
							{event?.categories.length !== 0 && (
								<Box className={classes.categoryWrap}>
									<Text className={classes.label}>Kategori</Text>
									<Group>
										{(Array.isArray(event.categories)
											? event.categories.slice(0, 3)
											: []
										)?.map((cat, index) => {
											return (
												<Text key={index} className={classes.category}>
													{cat?.name}
												</Text>
											);
										})}
									</Group>
								</Box>
							)}
						</Group>
						<Box className={classes.textInfoWrap}>
							{event?.featuredImage?.node?.sourceUrl && (
								<Image
									loading={'lazy'}
									className={classes.image}
									src={event?.featuredImage?.node?.sourceUrl}
									alt={event?.featuredImage?.node?.title}
								/>
							)}
							{event?.title && (
								<Title order={3} className={classes.title}>
									{event?.title}
								</Title>
							)}
							{event?.excerpt && (
								<Box
									className={classes.excerpt}
									dangerouslySetInnerHTML={{
										__html: event.excerpt.split('\n').join('<br />'),
									}}
								/>
							)}
							<Text className={classes.labelBig}>Dela denna händelse med andra</Text>
							<Group className={classes.socialWrap}>
								<Link
									href={`https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`}
									target="_blank"
									rel="noopener noreferrer"
									className={classes.link}
								>
									<IconLinkedin />
									<span>LinkedIn</span>
								</Link>

								<Link
									href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
									target="_blank"
									rel="noopener noreferrer"
									className={classes.link}
								>
									<IconFacebook />
									<span>Facebook</span>
								</Link>

								<Box onClick={copyLink} className={classes.link}>
									<IconCopy />
									<span>Kopiera</span>
								</Box>
							</Group>
						</Box>
					</SimpleGrid>
				</Group>
			</Container>
		</Box>
	);
};

export default SingleEvent;
