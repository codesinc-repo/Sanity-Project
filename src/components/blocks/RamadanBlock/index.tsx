'use client';

import { Box, Container, Group, Text, Title } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

import CustomButton from '@/components/Button';
import CounterIcon from '@/components/Icons/CounterIcon';
import CounterNightIcon from '@/components/Icons/CounterNightIcon';
import type { IButtonOptions, IIconOptions } from '@/helpers/global.interface';

import AfterBanner from '../AfterBanner';
import classes from './RamadanBlock.module.css';

interface TimeRow {
	datum: string;
	asr: string;
	duhur: string;
	fajr: string;
	isha: string;
	maghrib: string;
	shuruq: string;
	items_repeater: IIconOptions[];
}

interface RamadanBlockProps {
	data: {
		title: string;
		subtitle: string;
		hide_this_block: boolean;
		dark_image_mobile: string;
		dark_image: string;
		bright_image_mobile: string;
		bright_image: string;
		time_settings: TimeRow[];
		button_repeater: IButtonOptions[];
		items_repeater: IIconOptions[];
	};
}

const RamadanBlock = ({
	data: {
		title,
		subtitle,
		hide_this_block,
		dark_image_mobile,
		dark_image,
		bright_image_mobile,
		bright_image,
		time_settings,
		button_repeater,
		items_repeater,
	},
}: RamadanBlockProps) => {
	if (hide_this_block) return null;

	const [period, setPeriod] = useState<'day' | 'night' | null>(null);
	const [fullPeriodDuration, setFullPeriodDuration] = useState<number>(0);
	const [remainingTime, setRemainingTime] = useState<number>(0);
	const [buttons, setButtons] = useState<IButtonOptions[]>([]);
	const [backgroundImage, setBackgroundImage] = useState('');
	const [textColor, setTextColor] = useState('');
	const [mobileImage, setMobileImage] = useState('');
	const [backgroundColor, setBackgroundColor] = useState('');

	const prevPeriod = useRef<'day' | 'night' | null>(null);

	const parseTime = (time: string) => {
		if (!time) return 0;
		const [hours, minutes] = time.split(':').map(Number);
		return (hours || 0) * 3600 + (minutes || 0) * 60;
	};

	const updateTimer = () => {
		const now = new Date();
		const today = now.toLocaleDateString('en-GB').replace(/\//g, '/');
		const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

		const todayData = time_settings.find((t) => t.datum === today);
		const tomorrowDataIndex = time_settings.findIndex((t) => t.datum === today) + 1;
		const tomorrowData = time_settings[tomorrowDataIndex] || null;

		if (!todayData) return;

		const fajrToday = parseTime(todayData.fajr);
		const maghribToday = parseTime(todayData.maghrib);
		const fajrTomorrow = tomorrowData ? parseTime(tomorrowData.fajr) : null;

		let newPeriod: 'day' | 'night' | null = null;
		let newFullPeriodDuration = 0;
		let newRemainingTime = 0;

		if (currentTime >= fajrToday && currentTime < maghribToday) {
			newPeriod = 'day';
			newFullPeriodDuration = maghribToday - fajrToday;
			newRemainingTime = maghribToday - currentTime;
		} else if (fajrTomorrow && currentTime >= maghribToday) {
			newPeriod = 'night';
			newFullPeriodDuration = fajrTomorrow + 24 * 3600 - maghribToday;
			newRemainingTime = fajrTomorrow + 24 * 3600 - currentTime;
		}

		if (newPeriod !== period) {
			setPeriod(newPeriod);
			setFullPeriodDuration(newFullPeriodDuration);
			setRemainingTime(newRemainingTime);
		}
	};

	useEffect(() => {
		updateTimer();
	}, [time_settings]);

	useEffect(() => {
		if (!period || prevPeriod.current === period) return;

		if (period === 'night') {
			setBackgroundImage(dark_image);
			setTextColor('#F5E8B6');
			setMobileImage(dark_image_mobile);
			setBackgroundColor('#685BC7');
		} else {
			setBackgroundImage(bright_image);
			setTextColor('#685BC7');
			setMobileImage(bright_image_mobile);
			setBackgroundColor('#F5E8B6');
		}

		setButtons(
			button_repeater.map((item) => ({
				...item,
				color: period === 'night' ? 'yellow' : 'violet',
				icon_color: period === 'night' ? '#685BC7' : '#F5E8B6',
			})),
		);

		prevPeriod.current = period;
	}, [period]);

	const opacityStyle = period ? '1' : '0';

	return (
		<Box
			className={classes.ramadanBanner}
			style={{
				backgroundImage: `url(${backgroundImage})`,
				backgroundColor: `${backgroundColor}`,
			}}
		>
			<img className={classes.mobileImage} src={mobileImage} alt="image" />

			<Container className={classes.heroBannerContainer} size="xl">
				<Box className={classes.content}>
					<Box className={classes.counter} style={{ opacity: `${opacityStyle}` }}>
						{remainingTime > 0 && fullPeriodDuration > 0 && (
							<CountdownCircleTimer
								isPlaying
								size={170}
								strokeWidth={8}
								duration={fullPeriodDuration}
								initialRemainingTime={remainingTime}
								colors="#685BC7"
								rotation="counterclockwise"
								trailColor="rgba(255, 255, 255, 0)"
								isGrowing={false}
								onComplete={() => {
									updateTimer();
									return { shouldRepeat: true, delay: 0 };
								}}
							>
								{({ remainingTime: timeLeft }) => {
									const hours = Math.floor(timeLeft / 3600);
									const minutes = Math.floor((timeLeft % 3600) / 60);
									const seconds = timeLeft % 60;

									return (
										<Box className={classes.counterWrapper}>
											{period === 'day' && <CounterIcon />}

											{period === 'night' && <CounterNightIcon />}

											<Text className={classes.counterVal}>
												{hours}:{minutes.toString().padStart(2, '0')}:
												{seconds.toString().padStart(2, '0')}
											</Text>

											<Text className={classes.counterLabel}>
												{period === 'day'
													? 'Tid kvar till iftar'
													: 'Tid kvar på iftar'}
											</Text>

											<Text className={classes.counterLabel}>Uppsala</Text>
										</Box>
									);
								}}
							</CountdownCircleTimer>
						)}
					</Box>

					{title && (
						<Title style={{ color: textColor }} order={1} className={classes.title}>
							{title}
						</Title>
					)}
					{subtitle && (
						<Text style={{ color: textColor }} className={classes.subTitle}>
							{subtitle}
						</Text>
					)}

					{buttons && (
						<Group className={classes.buttonWrap} key={JSON.stringify(buttons)}>
							<CustomButton size={'big'} button={buttons} />
						</Group>
					)}
				</Box>
			</Container>

			<Box className={classes.logoWrap}>
				<AfterBanner
					externalClass={classes.afterBanner}
					data={{
						hide_this_block: false,
						items_repeater,
						title: '',
						is_first_block: false,
						background_color: 'transparent',
					}}
				/>
			</Box>
		</Box>
	);
};

export default React.memo(RamadanBlock);
