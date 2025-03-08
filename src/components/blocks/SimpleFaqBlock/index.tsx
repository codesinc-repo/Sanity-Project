'use client';

import { Accordion, Box, Container, Title } from '@mantine/core';
import type { FC } from 'react';
import React from 'react';

import classes from './SimpleFaqBlock.module.css';

interface ISimpleFaqBlockProps {
	data: {
		faq_accordion: IFaqAccordion[];
		faq_title: string;
		hide_this_block: string;
	};
}

interface IFaqAccordion {
	title: string;
	description: string;
}

const SimpleFaqBlock: FC<ISimpleFaqBlockProps> = ({
	data: { faq_title, faq_accordion, hide_this_block },
}) => {
	if (+hide_this_block) {
		return null;
	}

	const renderAccordionItems = (items: IFaqAccordion[]) => {
		return (Array.isArray(items) ? items : []).map((item, key) => (
			<Accordion.Item value={`item-${key}`} key={key}>
				<Accordion.Control className={classes.accordionText}>
					{item?.title}
				</Accordion.Control>
				<Accordion.Panel className={classes.accordionText}>
					<Box dangerouslySetInnerHTML={{ __html: item?.description }} />
				</Accordion.Panel>
			</Accordion.Item>
		));
	};

	return (
		<div className={classes.simpleFaqBlock}>
			<Container size="xl">
				{faq_title && (
					<Title order={2} className={classes.title}>
						{faq_title}
					</Title>
				)}

				<Accordion
					variant="separated"
					classNames={{
						root: classes.accordion,
						item: classes.item,
						control: classes.control,
						label: classes.label,
						content: classes.content,
						chevron: classes.chevron,
					}}
				>
					{renderAccordionItems(faq_accordion)}
				</Accordion>
			</Container>
		</div>
	);
};

export default SimpleFaqBlock;
