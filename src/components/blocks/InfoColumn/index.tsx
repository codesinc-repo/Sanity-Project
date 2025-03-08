'use client';

import { Box, Container, SimpleGrid, Title } from '@mantine/core';
import React from 'react';

import Svg from '@/components/Svg';
import type { IImage } from '@/helpers/global.interface';

import classes from './InfoColumn.module.css';

interface IInfoColumn {
	data: {
		hide_this_block: boolean;
		is_first_block: boolean;
		blocks: IBlocks[];
	};
}

interface IBlocks {
	icon: IImage;
	title: string;
	description: string;
}

const InfoColumn: React.FC<IInfoColumn> = ({
	data: { is_first_block, hide_this_block, blocks },
}) => {
	if (hide_this_block) {
		return null;
	}

	return (
		<div className={`${classes.infoColumn} ${is_first_block ? classes.firstBlock : ''}`}>
			<Container size="xl">
				<SimpleGrid
					cols={{
						base: 1,
					}}
					spacing={{
						base: 24,
						sm: 32,
						xl: 48,
					}}
					className={`${classes.inner}`}
				>
					{blocks &&
						blocks?.map((block, key) => {
							return (
								<Box className={classes.block} key={key}>
									<Box className={classes.blockIcon}>
										<Svg svg={block?.icon?.svg} width={24} height={24} />
									</Box>
									<Box className={classes.blockContent}>
										{block?.title && (
											<Title order={5} className={classes.title}>
												{block?.title}
											</Title>
										)}
										{block?.description && (
											<Box
												className={classes.description}
												dangerouslySetInnerHTML={{
													__html: block?.description,
												}}
											/>
										)}
									</Box>
								</Box>
							);
						})}
				</SimpleGrid>
			</Container>
		</div>
	);
};

export default InfoColumn;
