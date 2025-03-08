import { Box, Text } from '@mantine/core';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import { getTimeUntilEvent } from '@/helpers';

import classes from './DynamicTime.module.css';

interface IDynamicTimeProps {
	openingHours: {
		title: string;
		items: {
			time: string;
			title: string;
		}[];
		dynamic_time: {
			text: string;
			time_options: boolean;
			title: string;
		};
	};
}

const DynamicTime: FC<IDynamicTimeProps> = ({ openingHours }) => {
	const [timeUntilEvent, setTimeUntilEvent] = useState<string | null>(null);

	const checkStoreStatus = () => {
		const getTime = getTimeUntilEvent(
			openingHours?.items,
			openingHours?.dynamic_time?.time_options,
		);
		setTimeUntilEvent(getTime);
	};

	useEffect(() => {
		checkStoreStatus();
		const interval = setInterval(checkStoreStatus, 60000);
		return () => clearInterval(interval);
	}, [openingHours]);

	if (timeUntilEvent === null) return null;

	return (
		openingHours?.dynamic_time?.title &&
		openingHours?.dynamic_time?.text && (
			<Box className={classes.openingHoursContent}>
				<Text className={classes.boxText}>{openingHours?.dynamic_time?.title}</Text>
				<Text className={classes.boxText}>
					{timeUntilEvent !== '' ? timeUntilEvent : openingHours?.dynamic_time?.text}
				</Text>
			</Box>
		)
	);
};

export default DynamicTime;
