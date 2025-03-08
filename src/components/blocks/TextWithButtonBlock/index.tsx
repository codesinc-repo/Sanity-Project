'use client';

import { Box, Container, Group, Text, Title } from '@mantine/core';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FC } from 'react';
import React from 'react';

import classes from '@/components/blocks/TextWithButtonBlock/TextWithButtonBlock.module.css';
import CustomButton from '@/components/Button';
import type { IButtonOptions } from '@/helpers/global.interface';

interface ITextWithButtonBlockProps {
	data: {
		hide_this_block: string;
		is_first_block: boolean;
		after_submit: boolean;
		title: string;
		sub_title: string;
		button_repeater: IButtonOptions[];
	};
	lang: string;
}

const TextWithButtonBlock: FC<ITextWithButtonBlockProps> = ({ data, lang }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const isAfterSubmit = searchParams.get('afterSubmit');

	const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, btn: IButtonOptions) => {
		event.preventDefault();

		if (btn?.button?.url === '#logout') {
			Cookies.remove('gottsundaAuthToken');
			router.replace(`/${lang}/gottsundakalendern/inloggning`);
		} else {
			router.push(`/${lang}${btn?.button?.url}`);
		}
	};

	if (data?.hide_this_block || (isAfterSubmit ? !data?.after_submit : data?.after_submit)) {
		return null;
	}

	return (
		<Box
			className={`${classes.textWithButtonBlock} ${data?.is_first_block ? classes.firstBlock : ''}`}
		>
			<Container size="xl">
				<Box className={classes.content}>
					{data?.title && (
						<Title order={3} className={classes.title}>
							{data?.title}
						</Title>
					)}
					{data?.sub_title && <Text className={classes.subTitle}>{data?.sub_title}</Text>}
					{data?.button_repeater && (
						<Group className={classes.buttonWrap}>
							<CustomButton button={data?.button_repeater} onClick={handleClick} />
						</Group>
					)}
				</Box>
			</Container>
		</Box>
	);
};

export default TextWithButtonBlock;
