'use client';

import { Box, Container, Group, SimpleGrid, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

import CustomButton from '@/components/Button';
import Svg from '@/components/Svg';
import { addTargetSvg } from '@/helpers';
import type { IButtonOptions, IIconOptions, IImage } from '@/helpers/global.interface';

import classes from './HeroBanner.module.css';

interface HeroBannerProps {
	data: {
		desc: string;
		title: string;
		image: IImage;
		image_mobile: IImage;
		video: IImage;
		video_mobile: IImage;
		hide_this_block: boolean;
		media_type: boolean;
		background_color: string;
		is_close_description: string;
		items_repeater: IIconOptions[];
		button_repeater: IButtonOptions[];
	};
}

const HeroBanner = ({
	data: {
		title,
		desc,
		image,
		image_mobile,
		media_type,
		video,
		video_mobile,
		hide_this_block,
		items_repeater,
		background_color,
		button_repeater,
	},
}: HeroBannerProps) => {
	const isMobile = useMediaQuery('(max-width: 820px)');
	const mediaRef = useRef<HTMLDivElement | null>(null); // Ref to track media element container
	const [mediaHeight, setMediaHeight] = useState<number>(0); // State for dynamic height

	if (hide_this_block) return null;

	const imageMobileMedia = media_type ? video_mobile : image_mobile;
	const imageMedia = media_type ? video : image;

	const [processedHtml, setProcessedHtml] = useState<string>(desc);

	useEffect(() => {
		setProcessedHtml(addTargetSvg(desc, '#FFEBB4'));
	}, [desc]);

	// Dynamically calculate height based on width
	useEffect(() => {
		if (mediaRef.current) {
			const width = mediaRef.current.offsetWidth; // Get the width of the element
			setMediaHeight(width); // Set the height equal to the width
		}
	}, [isMobile]); // Recalculate on screen size changes

	// Lazy load images and apply sizes for optimization
	const renderMedia = (
		src: string,
		alt: string,
		width: number,
		height: number,
		selectType: 'image' | 'video',
	) => {
		if (selectType === 'video') {
			return (
				<video
					src={src}
					width={width}
					height={isMobile ? mediaHeight : height}
					autoPlay
					muted
					loop
					playsInline
					className={classes.image}
				/>
			);
		}

		return (
			<Image
				src={src}
				alt={alt}
				width={width}
				height={isMobile ? mediaHeight : height}
				loading="lazy"
				className={classes.image}
			/>
		);
	};

	return (
		<Box className={classes.heroBanner} style={{ backgroundColor: background_color }}>
			<Container className={classes.heroBannerContainer} size="xl">
				<SimpleGrid cols={1} spacing={32} className={classes.inner}>
					{/* Render mobile image if available */}
					<Box ref={mediaRef}>
						{isMobile &&
							imageMobileMedia?.url &&
							renderMedia(
								imageMobileMedia.url,
								imageMobileMedia.title,
								382,
								382,
								media_type ? 'video' : 'image',
							)}
					</Box>

					<Box className={classes.content} style={{ paddingTop: 70 }}>
						{title && (
							<Title order={1} className={classes.title}>
								{title}
							</Title>
						)}

						{processedHtml && (
							<Box
								className={classes.description}
								dangerouslySetInnerHTML={{ __html: processedHtml }}
							/>
						)}

						{/* Render items if available */}
						{items_repeater && (
							<Box className={classes.lists}>
								{(Array.isArray(items_repeater) ? items_repeater : []).map(
									(item, key) => (
										<Group className={classes.listItem} key={key}>
											{item.item_icon && (
												<Svg
													width={24}
													height={24}
													className={classes.item_icon}
													style={item.icon_color}
													svg={item.item_icon.svg}
												/>
											)}
											{item.item_text && (
												<Text className={classes.itemText}>
													{item.item_text}
												</Text>
											)}
										</Group>
									),
								)}
							</Box>
						)}

						{/* Render buttons if available */}
						{button_repeater && (
							<Group className={classes.buttonWrap}>
								<CustomButton button={button_repeater} size="big" />
							</Group>
						)}
					</Box>
				</SimpleGrid>
			</Container>

			{/* Render desktop image if available */}
			{!isMobile &&
				imageMedia?.url &&
				renderMedia(
					imageMedia.url,
					imageMedia.title,
					877,
					877,
					media_type ? 'video' : 'image',
				)}
		</Box>
	);
};

export default React.memo(HeroBanner);
