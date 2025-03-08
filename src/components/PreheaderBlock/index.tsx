'use client';

import { Box, Container } from '@mantine/core';
import { getCookie, setCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';

import { useThemeContext } from '@/context/theme.context';

import classes from './PreheaderBlock.module.css';

const PreheaderBlock = () => {
	const { themeSettings } = useThemeContext();
	const cookieAccept = !!getCookie('gottsunda_preheader_ignore');
	const [isOpenCookie, setIsOpenCookie] = useState(false);
	const activeElem = !cookieAccept && isOpenCookie ? classes.active : '';

	const ignoreCookiesHandler = () => {
		const headerBlock = document.querySelector('header') as HTMLElement;

		setCookie('gottsunda_preheader_ignore', true, {
			path: '/',
			maxAge: 60 * 60 * 24 * 90, // mil *
		});
		setIsOpenCookie(false);
		headerBlock.style.top = '34px';
	};

	useEffect(() => {
		const headerBlock = document.querySelector('header') as HTMLElement;

		const handleResize = () => {
			if (!cookieAccept) {
				if (window.innerWidth > 1024) {
					headerBlock.style.top = '56px';
				} else {
					headerBlock.style.top = '0';
				}
			}
		};

		window.addEventListener('resize', handleResize);

		const openCookie = setTimeout(() => {
			setIsOpenCookie(true);
			handleResize();
		}, 1000);

		return () => {
			window.removeEventListener('resize', handleResize);
			clearTimeout(openCookie);
		};
	}, [cookieAccept]);

	useEffect(() => {
		const currentTime = new Date().getTime();
		const dateString = themeSettings?.timeWhenPreheaderClose;
		if (dateString && !cookieAccept) {
			const [datePart, timePart] = dateString.split('T');

			if (datePart && timePart) {
				const [year, month, day] = datePart.split('-') as [string, string, string];
				const [hours, minutes, seconds] = timePart.replace('Z', '').split(':') as [
					string,
					string,
					string,
				];

				const preheaderCloseTime = new Date(
					parseInt(year, 10),
					parseInt(month, 10) - 1,
					parseInt(day, 10),
					parseInt(hours, 10),
					parseInt(minutes, 10),
					parseInt(seconds, 10),
				);

				if (currentTime > preheaderCloseTime.getTime()) {
					ignoreCookiesHandler();
				}
			}
		}
	}, [themeSettings?.timeWhenPreheaderClose]);

	return (
		<Box className={`${classes.preheaderBlock} ${activeElem}`}>
			<Container className={classes.inner} size="xl">
				<Box
					className={classes.content}
					dangerouslySetInnerHTML={{ __html: themeSettings?.preheaderContent }}
				/>
				<Box className={classes.close} onClick={ignoreCookiesHandler}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M3.52861 3.52876C3.78896 3.26841 4.21107 3.26841 4.47141 3.52876L8.00001 7.05735L11.5286 3.52876C11.789 3.26841 12.2111 3.26841 12.4714 3.52876C12.7318 3.78911 12.7318 4.21122 12.4714 4.47157L8.94282 8.00016L12.4714 11.5288C12.7318 11.7891 12.7318 12.2112 12.4714 12.4716C12.2111 12.7319 11.789 12.7319 11.5286 12.4716L8.00001 8.94297L4.47141 12.4716C4.21107 12.7319 3.78896 12.7319 3.52861 12.4716C3.26826 12.2112 3.26826 11.7891 3.52861 11.5288L7.0572 8.00016L3.52861 4.47157C3.26826 4.21122 3.26826 3.78911 3.52861 3.52876Z"
							fill="white"
						/>
					</svg>
				</Box>
			</Container>
		</Box>
	);
};

export default PreheaderBlock;
