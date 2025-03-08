'use client';

import { Box, Container, Group } from '@mantine/core';
import { getCookie, setCookie } from 'cookies-next';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';

import { useThemeContext } from '@/context/theme.context';
import type { IButtonOptions } from '@/helpers/global.interface';

import CustomButton from '../Button';
import classes from './CookiesBlock.module.css';

const CookiesBlock = ({ lang }: { lang: string }) => {
	const { themeSettings } = useThemeContext();

	const cookieAccept = !!getCookie('gottsunda_cookie_accept');
	const [isOpenCookie, setIsOpenCookie] = useState(false);
	const activeElem = !cookieAccept && isOpenCookie ? classes.active : '';

	// Decline cookies
	const declineCookiesHandler = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		setIsOpenCookie(false);
	};

	// Allow cookies
	const allowCookiesHandler = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		setCookie('gottsunda_cookie_accept', true, {
			path: '/',
			maxAge: 60 * 60 * 24 * 90, // mil *
		});
		setIsOpenCookie(false);
	};

	const handleButtonClick = (event: React.MouseEvent<HTMLElement>, btn: IButtonOptions) => {
		if (btn?.button?.url === '#decline') {
			declineCookiesHandler(event);
		} else {
			allowCookiesHandler(event);
		}
	};

	useEffect(() => {
		const openCookie = setTimeout(() => {
			setIsOpenCookie(true);
		}, 5000);
		return () => clearTimeout(openCookie);
	}, []);

	useEffect(() => {
		Cookies.set('gottsundaCurrentLang', lang, { expires: 365 });
	}, [lang]);

	return (
		<Box className={`${classes.cookiesBlock} ${activeElem}`}>
			<Container size="xl">
				<Group className={classes.inner}>
					<Group className={classes.contentWrap}>
						<Box
							className={classes.content}
							dangerouslySetInnerHTML={{ __html: themeSettings?.cookiesContent }}
						/>
					</Group>
					{themeSettings?.cookiesButtonRepeater && (
						<Group gap={'md'} className={classes.buttonWrap}>
							<CustomButton
								button={themeSettings?.cookiesButtonRepeater}
								onClick={handleButtonClick}
							/>
						</Group>
					)}
				</Group>
			</Container>
		</Box>
	);
};

export default CookiesBlock;
