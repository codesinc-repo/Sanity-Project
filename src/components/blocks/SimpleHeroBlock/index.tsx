'use client';

import { Box, Container, SimpleGrid, Title } from '@mantine/core';
import React from 'react';

import classes from './SimpleHeroBlock.module.css';

interface SimpleHeroBlockProps {
	data: {
		desc: string;
		title: string;
		big_content: string;
		hide_this_block: boolean;
		block_grid: boolean;
		is_first_block: boolean;
	};
}

const SimpleHeroBlock: React.FC<SimpleHeroBlockProps> = ({
	data: { is_first_block, title, desc, big_content, hide_this_block, block_grid },
}) => {
	if (hide_this_block) {
		return null;
	}

	return (
		<Box className={`${classes.simpleHeroBlock} ${is_first_block ? classes.firstBlock : ''}`}>
			<Container size="xl">
				<SimpleGrid
					cols={{
						base: 1,
						sm: 1,
						md: 2,
					}}
					className={`${classes.inner}
					${block_grid ? classes.blockGrid : ''}`}
				>
					<Box className={`${classes.content} `}>
						{title && (
							<Title order={3} className={classes.title}>
								{title}
							</Title>
						)}
						{desc && (
							<Box
								className={classes.desc}
								dangerouslySetInnerHTML={{ __html: desc }}
							/>
						)}
					</Box>
					{big_content && (
						<Box
							className={classes.desc}
							dangerouslySetInnerHTML={{ __html: big_content }}
						/>
					)}
				</SimpleGrid>
			</Container>
		</Box>
	);
};

export default SimpleHeroBlock;
