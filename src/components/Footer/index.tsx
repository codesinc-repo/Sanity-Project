'use client';

import { Box, Container, Group, Image, SimpleGrid, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { useThemeContext } from '@/context/theme.context';
import { determineContactType, modifyLinks } from '@/helpers';

import classes from './Footer.module.css';

interface FooterLink {
	link: string;
	label: string;
}

interface FooterActionProps {
	links: { [key: string]: FooterLink[] };
	lang: string;
}

export function Footer({ links, lang }: FooterActionProps) {
	const { themeSettings } = useThemeContext();

	const isMobile = useMediaQuery('(max-width: 820px)');
	const pathname = usePathname();

	const footerLabelMenuArray = themeSettings?.footerMenuLabelsTitle?.split(',');
	const footerMenuArray = themeSettings?.footerMenu?.replace(/\s+/g, '').split(',');

	const updateLinks = (Array.isArray(footerMenuArray) ? footerMenuArray : [])?.map(
		(menu, index) => {
			const key: string = menu?.trim();
			return {
				links: links[key],
				title: footerLabelMenuArray?.[index],
			};
		},
	);

	const groups = updateLinks?.map((group, key: number) => {
		const footerLinks = (Array.isArray(group?.links) ? group?.links : [])?.map(
			(link, index: number) => (
				<Link key={index} className={classes.link} href={modifyLinks(link?.link, lang)}>
					{link?.label}
				</Link>
			),
		);
		const lastMenu = (menuKey: number) => {
			if (updateLinks.length - 1 !== menuKey) return null;
			return (
				<Box
					className={classes.lastMenu}
					dangerouslySetInnerHTML={{ __html: themeSettings?.footerMenuThirdContent }}
				/>
			);
		};

		return (
			<div className={classes.wrapper} key={key}>
				<Text size={'md'} fw={600} mb={12} className={classes.title}>
					{group?.title}
				</Text>
				{footerLinks}
				{lastMenu(key)}
			</div>
		);
	});

	return (
		<footer className={classes.footer}>
			<Container size="xl">
				<Box className={classes.inner}>
					{isMobile && (
						<Box className={classes.logoBlockWrap}>
							{themeSettings?.footerLogo?.node?.sourceUrl && (
								<Link href={`/${lang}/`} className={classes.logoWrap}>
									<Image
										loading={'lazy'}
										className={classes.logo}
										src={themeSettings?.footerLogo?.node?.sourceUrl}
										alt={themeSettings?.footerLogo?.node?.title}
										width={175}
										height={43}
									/>
								</Link>
							)}
							{themeSettings?.footerDescription && (
								<Box className={classes.descriptionWrap}>
									{themeSettings?.footerDescription.map((item, key) => {
										return item?.format ? (
											<a
												key={key}
												className={classes.descriptionLink}
												target={'_blank'}
												href={determineContactType(item?.title)}
											>
												{item?.title}
											</a>
										) : (
											<Text key={key} className={classes.descriptionText}>
												{item?.title}
											</Text>
										);
									})}
								</Box>
							)}
							{themeSettings?.footerSocialLinks && (
								<Box className={classes.socialWrap}>
									{themeSettings?.footerSocialLinks.map((item, key) => {
										return (
											<a
												key={key}
												className={classes.social}
												target={'_blank'}
												href={item?.link}
											>
												<Image
													loading={'lazy'}
													className={classes.logo}
													src={item?.icon?.node?.sourceUrl}
													alt={item?.icon?.node?.title}
													width={24}
													height={24}
												/>
											</a>
										);
									})}
								</Box>
							)}
						</Box>
					)}
					<SimpleGrid
						cols={{
							base: 2,
							sm: 3,
							md: 4,
						}}
						className={classes.groups}
					>
						{!isMobile && (
							<Box className={classes.logoBlockWrap}>
								{themeSettings?.footerLogo?.node?.sourceUrl && (
									<Link href={`/${lang}/`} className={classes.logoWrap}>
										<Image
											loading={'lazy'}
											className={classes.logo}
											src={themeSettings?.footerLogo?.node?.sourceUrl}
											alt={themeSettings?.footerLogo?.node?.title}
											width={175}
											height={43}
										/>
									</Link>
								)}
								{themeSettings?.footerDescription && (
									<Box className={classes.descriptionWrap}>
										{themeSettings?.footerDescription.map((item, key) => {
											return item?.format ? (
												<a
													key={key}
													className={classes.descriptionLink}
													target={'_blank'}
													href={determineContactType(item?.title)}
												>
													{item?.title}
												</a>
											) : (
												<Text key={key} className={classes.descriptionText}>
													{item?.title}
												</Text>
											);
										})}
									</Box>
								)}
								{themeSettings?.footerSocialLinks && (
									<Box className={classes.socialWrap}>
										{themeSettings?.footerSocialLinks.map((item, key) => {
											return (
												<a
													key={key}
													className={classes.social}
													target={'_blank'}
													href={item?.link}
												>
													<Image
														loading={'lazy'}
														className={classes.logo}
														src={item?.icon?.node?.sourceUrl}
														alt={item?.icon?.node?.title}
														width={24}
														height={24}
													/>
												</a>
											);
										})}
									</Box>
								)}
							</Box>
						)}

						{groups}
					</SimpleGrid>
					{isMobile && (
						<Group>
							{themeSettings?.footerLanguageTitle && (
								<Text>{themeSettings?.footerLanguageTitle}</Text>
							)}
							<Group className={classes.languageWrap}>
								{/* <Link */}
								{/*	className={`${classes.language} ${pathname.includes('sv') ? classes.languageActive : ''}`} */}
								{/*	href={'/sv/'} */}
								{/* > */}
								{/*	Svenska */}
								{/* </Link> */}
								<Link
									className={`${classes.language} ${pathname.includes('en') ? classes.languageActive : ''}`}
									href={'/en/'}
								>
									English
								</Link>
							</Group>
						</Group>
					)}
					<Box className={classes.line} />
					<Box className={classes.afterFooter}>
						<Group className={classes.afterFooterInner}>
							{themeSettings?.footerCopyright && (
								<Text>{themeSettings?.footerCopyright}</Text>
							)}
							{themeSettings?.footerPrivacyLink && (
								<Link
									className={classes.privacyLink}
									href={modifyLinks(
										`/${themeSettings?.footerPrivacyLink?.nodes[0]?.slug}` ||
											'',
										lang,
									)}
								>
									{themeSettings?.footerPrivacyLink?.nodes[0]?.title}
								</Link>
							)}
							{themeSettings?.footerCookies && (
								<Link
									className={classes.privacyLink}
									href={modifyLinks(
										`/${themeSettings?.footerCookies?.nodes[0]?.slug}` || '',
										lang,
									)}
								>
									{themeSettings?.footerCookies?.nodes[0]?.title}
								</Link>
							)}
							{themeSettings?.footerProducerad && (
								<Box
									className={classes.footerProducerad}
									dangerouslySetInnerHTML={{
										__html: themeSettings?.footerProducerad,
									}}
								/>
							)}
						</Group>
						{!isMobile && (
							<Group>
								{themeSettings?.footerLanguageTitle && (
									<Text>{themeSettings?.footerLanguageTitle}</Text>
								)}
								<Group className={classes.languageWrap}>
									{/* <Link */}
									{/*	className={`${classes.language} ${pathname.includes('sv') ? classes.languageActive : ''}`} */}
									{/*	href={'/sv/'} */}
									{/* > */}
									{/*	Svenska */}
									{/* </Link> */}
									<Link
										className={`${classes.language} ${pathname.includes('en') ? classes.languageActive : ''}`}
										href={'/en/'}
									>
										English
									</Link>
								</Group>
							</Group>
						)}
					</Box>
				</Box>
			</Container>
		</footer>
	);
}
