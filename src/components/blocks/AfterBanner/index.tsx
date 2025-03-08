'use client';

import { Box, Container, Group, Text } from '@mantine/core';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { IIconOptions } from '@/helpers/global.interface';

import classes from './AfterBanner.module.css';

const Svg = React.lazy(() => import('@/components/Svg'));

interface AfterBannerProps {
	data: {
		hide_this_block: boolean;
		is_first_block: boolean;
		background_color: string;
		title: string;
		items_repeater: IIconOptions[];
	};
	externalClass?: string;
}

const AfterBanner = ({
	data: { hide_this_block, items_repeater, title, is_first_block, background_color },
	externalClass,
}: AfterBannerProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [totalWidth, setTotalWidth] = useState<number>(0);

	const icons = useMemo(() => {
		if (!items_repeater) {
			return [];
		}

		const originalIcons = (Array.isArray(items_repeater) ? items_repeater : []).map(
			(card, index) =>
				card?.item_icon && (
					<Svg
						key={`original_${index}`}
						svg={card?.item_icon?.svg}
						style={card?.icon_color}
						className={classes.icon}
					/>
				),
		);

		// Clone the original icons and set them up side by side
		const clonedIcons = Array.from({ length: 2 }).flatMap((_, repeatIndex) =>
			(Array.isArray(originalIcons) ? originalIcons : []).map((icon, index) =>
				React.cloneElement(icon, {
					key: `cloned_${repeatIndex}_${index + items_repeater.length}`,
				}),
			),
		);

		return [...originalIcons, ...clonedIcons];
	}, [items_repeater]);

	const handleResize = useCallback(() => {
		if (containerRef.current) {
			const newWidth = containerRef.current.scrollWidth;
			if (newWidth !== totalWidth) {
				setTotalWidth(newWidth);
			}
		}
	}, [totalWidth]);

	useEffect(() => {
		handleResize();
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [handleResize]);

	useEffect(() => {
		if (!containerRef.current || totalWidth === 0) {
			return;
		}

		let scrollPosition = 0;

		const animateScroll = () => {
			scrollPosition += 1;

			if (scrollPosition >= totalWidth) {
				scrollPosition = 0;
			}

			if (containerRef.current) {
				containerRef.current.style.transform = `translateX(${-scrollPosition}px)`;
			}

			requestAnimationFrame(animateScroll);
		};

		const animationId = requestAnimationFrame(animateScroll);

		return () => cancelAnimationFrame(animationId);
	}, [totalWidth]);

	if (hide_this_block) {
		return null;
	}

	return (
		<Box
			style={{ backgroundColor: background_color }}
			className={`${externalClass} ${classes.afterBanner} ${is_first_block ? classes.firstBlock : ''}`}
		>
			<Container size="xl">
				<Box className={classes.inner}>
					{title && <Text className={classes.title}>{title}</Text>}
					<Box className={classes.cardsWrap}>
						<Group ref={containerRef} className={classes.cards}>
							{icons}
						</Group>
					</Box>
				</Box>
			</Container>
		</Box>
	);
};

export default AfterBanner;
