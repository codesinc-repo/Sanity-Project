'use client';

import { Box, Container, Image, Text, Title } from '@mantine/core';
import Link from 'next/link';
import type { FC } from 'react';
import React, { useState } from 'react';

import ArrowRightIcon from '@/components/Icons/ArrowRightIcon';
import { convertDate } from '@/helpers';
import type { IPost } from '@/helpers/global.interface';

import classes from './BlogBlock.module.css';

interface IBlogComponentProps {
	title: string;
	subTitle: string;
	posts: IPost[];
}

const BlogComponent: FC<IBlogComponentProps> = ({ title, subTitle, posts }) => {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);

	return (
		<Box className={`${classes.blogComponent} `}>
			<Container size="xl">
				{title && (
					<Title order={5} className={classes.title}>
						{title}
					</Title>
				)}
				{subTitle && <Text className={classes.subTitle}>{subTitle}</Text>}
				{posts && (
					<Box className={classes.cards}>
						{(Array.isArray(posts) ? posts : [])?.map((item, idx) => {
							return (
								<Box
									key={idx}
									className={`${classes.blogCard} ${
										hoveredIndex === idx ? classes.hovered : classes.notHovered
									}`}
									onMouseEnter={() => setHoveredIndex(idx)}
									onMouseLeave={() => setHoveredIndex(0)}
								>
									<Box className={`${classes.blogCardImage}`}>
										<Image
											loading={'lazy'}
											src={item?.featuredImage?.node?.sourceUrl}
											alt={item?.featuredImage?.node?.title}
										/>
									</Box>
									{item?.date && (
										<Text className={classes.blogCardDate}>
											{convertDate(item?.date)}
										</Text>
									)}
									{item?.title && (
										<Box className={classes.blogCardTitleWrap}>
											<Text className={classes.blogCardTitle}>
												{item?.title}
											</Text>
											<Box className={classes.blogCardIcon}>
												<ArrowRightIcon />
											</Box>
										</Box>
									)}
									{item?.slug && (
										<Link
											className={classes.blogCardLink}
											href={`/nyheter/${item?.slug}`}
										/>
									)}
								</Box>
							);
						})}
					</Box>
				)}
			</Container>
		</Box>
	);
};
export default BlogComponent;
