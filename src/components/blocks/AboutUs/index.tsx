'use client';

import 'swiper/css';
import 'swiper/css/pagination';

import { Box, Container, Group, Image, SimpleGrid, Text, Title } from '@mantine/core';
import Link from 'next/link';
import type { FC } from 'react';
import { memo, useMemo } from 'react';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import CustomButton from '@/components/Button';
import DynamicTime from '@/components/DynamicTime';
import IconExternalLink from '@/components/Icons/IconExternalLink';
import Svg from '@/components/Svg';
import type { IButton, IButtonOptions, IImage } from '@/helpers/global.interface';

import classes from './AboutUs.module.css';

interface IAboutUsBlock {
	data: {
		hide_this_block: boolean;
		is_first_block: boolean;
		title: string;
		subtitle: string;
		block_content_background_color: string;
		block_content_text_color: string;
		gallery: IImage[];
		contact_us_title: string;
		contact_us_items: {
			item_icon: IImage;
			icon_color: string;
			link: IButton;
		}[];
		opening_hours: {
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
		button_repeater: IButtonOptions[];
	};
}

const AboutUsBlock: FC<IAboutUsBlock> = ({
	data: {
		hide_this_block,
		title,
		subtitle,
		gallery,
		contact_us_title,
		contact_us_items,
		opening_hours,
		button_repeater,
		is_first_block,
		block_content_background_color,
		block_content_text_color,
	},
}) => {
	if (hide_this_block) return null;

	const contactUsItems = useMemo(() => {
		return (Array.isArray(contact_us_items) ? contact_us_items : [])?.map((item, idx) => {
			return (
				<Box key={item?.link?.url ?? idx} className={classes.boxLinkWrap}>
					<Svg
						svg={item?.item_icon?.svg}
						style={item?.icon_color}
						className={classes.icon}
					/>
					{item?.link?.url && (
						<Link
							href={item?.link?.url}
							target={item?.link?.target}
							className={classes.boxLink}
						>
							{item?.link?.title}
							{item?.link?.target && (
								<IconExternalLink fill={block_content_text_color} />
							)}
						</Link>
					)}
				</Box>
			);
		});
	}, [contact_us_items]);

	const openingHoursItems = useMemo(() => {
		return (Array.isArray(opening_hours?.items) ? opening_hours?.items : [])?.map(
			(hour, idx) => (
				<Box key={idx} className={classes.openingHoursContent}>
					<Text className={classes.boxText}>{hour?.title}</Text>
					<Text className={classes.boxText}>{hour?.time}</Text>
				</Box>
			),
		);
	}, [opening_hours?.items]);

	return (
		<Box className={`${classes.aboutUs} ${is_first_block ? classes.firstBlock : ''}`}>
			<Container size={'xl'}>
				<Box className={classes.inner}>
					{title && (
						<Title order={5} className={classes.title}>
							{title}
						</Title>
					)}
					{subtitle && <Text className={classes.subTitle}>{subtitle}</Text>}
					<SimpleGrid
						spacing={{
							base: 16,
							sm: 24,
						}}
						className={classes.cards}
					>
						<Box
							className={classes.content}
							style={{
								backgroundColor: block_content_background_color,
								color: block_content_text_color,
							}}
						>
							{contact_us_title && (
								<Text className={classes.boxTitle}>{contact_us_title}</Text>
							)}
							{contactUsItems?.length > 0 && (
								<Box className={classes.contactWrap}>{contactUsItems}</Box>
							)}
							{opening_hours?.title && (
								<Text className={classes.boxTitle}>{opening_hours?.title}</Text>
							)}
							{openingHoursItems?.length > 0 && (
								<Box className={classes.openingHoursWrap}>
									<DynamicTime openingHours={opening_hours} />
									{openingHoursItems}
								</Box>
							)}
							{button_repeater && (
								<Group className={classes.buttonWrap}>
									<CustomButton button={button_repeater} />
								</Group>
							)}
						</Box>
						<Box className={classes.sliderWrap}>
							<Swiper
								className={classes.slider}
								slidesPerView={1}
								spaceBetween={16}
								loop={true}
								modules={[Pagination]}
								pagination={{ clickable: true }}
							>
								{(Array.isArray(gallery) ? gallery : [])?.map((card, index) => (
									<SwiperSlide className={classes.slideWrap} key={index}>
										{card?.url && (
											<Image
												loading={'lazy'}
												src={card?.url}
												alt={'Slide image'}
												className={classes.slideImage}
											/>
										)}
									</SwiperSlide>
								))}
							</Swiper>
						</Box>
					</SimpleGrid>
				</Box>
			</Container>
		</Box>
	);
};

export default memo(AboutUsBlock);
