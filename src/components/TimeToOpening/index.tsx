import { Box, Text } from '@mantine/core';
import type { FC } from 'react';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { useThemeContext } from '@/context/theme.context';
import { checkStoreStatusAndGetTimeToClosing } from '@/helpers';

import classes from './TimeToOpening.module.css';

interface ITimeToOpeningProps {
	coloredHeader?: string;
	className?: string;
}

const TimeToOpening: FC<ITimeToOpeningProps> = ({ coloredHeader, className = '' }) => {
	const { themeSettings } = useThemeContext();
	const [timeToClose, setTimeToClose] = useState<string | null>(null);

	const isTimerShow = useMemo(
		() => themeSettings?.showTimer?.toLowerCase() === 'yes',
		[themeSettings],
	);

	const storeHours = useMemo(
		() => ({
			weekDays: themeSettings.weekDays,
			saturday: themeSettings.saturday,
			sunday: themeSettings.sunday,
			holidays: themeSettings.holidays,
		}),
		[themeSettings],
	);

	const checkStoreStatus = useCallback(() => {
		const currentDateTime = new Date();
		const timeToClosing = checkStoreStatusAndGetTimeToClosing(currentDateTime, storeHours);
		setTimeToClose(timeToClosing);
	}, [storeHours]);

	useEffect(() => {
		if (!isTimerShow) return;

		checkStoreStatus(); // Initial check
		const interval = setInterval(checkStoreStatus, 1000);
		return () => clearInterval(interval); // Cleanup interval on unmount
	}, [checkStoreStatus, isTimerShow]);

	if (!isTimerShow || !timeToClose) return null;

	return (
		<Box
			style={{ backgroundColor: coloredHeader }}
			className={`${classes.openStoreWrap} ${className} `}
		>
			<Text className={classes.openStoreText}>{timeToClose}</Text>
		</Box>
	);
};

export default memo(TimeToOpening);
