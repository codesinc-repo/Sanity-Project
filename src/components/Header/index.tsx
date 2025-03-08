'use client';

import { Box, Center, Container, Group, Menu, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import IconChevronDown from '@/components/Icons/IconChevronDown';
import IconLogo from '@/components/Icons/IconLogo';
import TimeToOpening from '@/components/TimeToOpening';
import { hexToRgba, isActiveLink, modifyLinks } from '@/helpers';

import classes from './Header.module.css';

interface HeaderLink {
	link: string;
	label: string;
	links?: HeaderLink[];
}

interface HeaderActionProps {
	links?: HeaderLink[];
	pages: {
		modified: string;
		uri: string;
	}[];
	lang: string;
	pageOptions?: string;
}

export default function Header({
	links = [],
	pages,
	lang,
	pageOptions = '#685BC7',
}: HeaderActionProps) {
	const pathname = usePathname();
	const router = useRouter();

	const [isOpenMenu, setIsOpenMenu] = useState(false);
	const [openItems, setOpenItems] = useState<string[]>([]);
	const [headerColor, setHeaderColor] = useState(pageOptions);

	const isMobile = useMediaQuery('(max-width: 1024px)');
	const isHomePage = pathname === '/';
	const headerClass = `${classes.header} ${isHomePage ? classes.home : ''} `;
	const toggleMenu = () => setIsOpenMenu((prev) => !prev);
	const toggleItem = (link: string) =>
		setOpenItems((prev) =>
			prev.includes(link) ? prev.filter((item) => item !== link) : [...prev, link],
		);

	useEffect(() => {
		const holidayBlock = document.querySelector('[data-block="holiday"]');

		if (!holidayBlock) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry && entry.isIntersecting) {
					setHeaderColor(pageOptions);
				} else {
					setHeaderColor('#685BC7');
				}
			},
			{ threshold: 0.1 },
		);

		observer.observe(holidayBlock);

		return () => {
			observer.unobserve(holidayBlock);
		};
	}, [pageOptions]);

	// Redirect Rules
	useEffect(() => {
		pages.forEach((page) => {
			const redirectSlug = (page.uri || '').replace(/\/$/, '').split('/').pop();
			const path =
				process.env.NEXT_PUBLIC_SITE_URL &&
				(page.uri || '').replace(process.env.NEXT_PUBLIC_SITE_URL, '');

			if (pathname === `/${redirectSlug}/` && path) {
				router.push(path);
			}
		});
	}, [pages, pathname, router]);

	// Apply fill colors to SVG paths
	useEffect(() => {
		const applyFillToPaths = () => {
			document.querySelectorAll('span[data-fill]').forEach((span) => {
				const fillValue = span.getAttribute('data-fill');
				const pathElement = span.querySelector<SVGElement>('svg path');

				if (fillValue && pathElement) {
					pathElement.style.fill =
						pathElement.getAttribute('fill') !== null
							? fillValue
							: pathElement.style.fill;
					pathElement.style.stroke =
						pathElement.getAttribute('stroke') !== null
							? fillValue
							: pathElement.style.stroke;
				}
			});
		};

		const timeoutId = setTimeout(applyFillToPaths, 300);
		return () => clearTimeout(timeoutId);
	}, []);

	// Lock body scroll when menu is open
	useEffect(() => {
		document.body.style.overflow = isOpenMenu ? 'hidden' : 'auto';
	}, [isOpenMenu]);

	const renderLinks = useCallback(
		(headerLinks: HeaderLink[], mobile = false) =>
			headerLinks.map((link, index) => {
				const hasChildren = link.links && link.links.length > 0;
				const isActive = isActiveLink(pathname, link.link, lang);
				const modifiedLink = modifyLinks(link.link, lang);

				if (hasChildren) {
					const isOpen = openItems.includes(link.link);

					return (
						<Box key={index} className={classes.itemWithChild}>
							<Group
								className={`${classes.itemWithChildWrap}`}
								style={{
									backgroundColor: isActive ? hexToRgba(headerColor, 0.15) : '',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = hexToRgba(
										headerColor,
										0.15,
									);
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = isActive
										? hexToRgba(headerColor, 0.15)
										: '';
								}}
							>
								<Link
									href={modifiedLink}
									onClick={toggleMenu}
									style={{
										color: headerColor,
									}}
									className={classes.link}
								>
									<span className={classes.linkLabel}>{link.label}</span>
								</Link>
								<IconChevronDown
									fill={headerColor}
									onClick={() => toggleItem(link.link)}
									className={`${isOpen ? classes.open : ''}`}
								/>
							</Group>
							{isOpen && (
								<Group className={`${classes.mobileLinksChild} ${classes.child}`}>
									{renderLinks(link.links || [], mobile)}
								</Group>
							)}
						</Box>
					);
				}

				return (
					<Group
						key={index}
						className={`${classes.itemWithChildWrap}`}
						style={{
							backgroundColor: isActive ? hexToRgba(headerColor, 0.15) : '',
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = hexToRgba(headerColor, 0.15);
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = isActive
								? hexToRgba(headerColor, 0.15)
								: '';
						}}
					>
						<Link
							href={modifiedLink}
							onClick={toggleMenu}
							className={classes.link}
							style={{
								color: headerColor,
							}}
						>
							{link.label}
						</Link>
					</Group>
				);
			}),
		[lang, openItems, headerColor, isHomePage, pathname],
	);

	const desktopLinks = links.map((link, index) => {
		const isActive = isActiveLink(pathname, link.link, lang);
		const modifiedLink = modifyLinks(link.link, lang);

		return link.links ? (
			<Menu
				key={index}
				trigger="hover"
				position="top-start"
				transitionProps={{ exitDuration: 0 }}
				withinPortal
			>
				<Menu.Target>
					<Link
						href={modifiedLink}
						className={classes.link}
						style={{
							color: headerColor,
							backgroundColor: isActive ? hexToRgba(headerColor, 0.15) : '',
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = hexToRgba(headerColor, 0.15);
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = isActive
								? hexToRgba(headerColor, 0.15)
								: '';
						}}
					>
						<Center>
							<span className={classes.linkLabel}>{link.label}</span>
							<IconChevronDown fill={headerColor} width={19} height={19} />
						</Center>
					</Link>
				</Menu.Target>
				<Menu.Dropdown
					classNames={{
						dropdown: classes.dropdown,
					}}
				>
					{link.links.map((subLink, key) => {
						const isSubActive = isActiveLink(pathname, subLink.link, lang);
						return (
							<Menu.Item key={key} className={classes.childLinkWrap}>
								<Link
									href={modifyLinks(subLink.link, lang)}
									style={{
										color: headerColor,
										backgroundColor: isSubActive
											? hexToRgba(headerColor, 0.15)
											: '',
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.backgroundColor = hexToRgba(
											headerColor,
											0.15,
										);
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.backgroundColor = isSubActive
											? hexToRgba(headerColor, 0.15)
											: '';
									}}
									className={classes.childLink}
								>
									{subLink.label}
								</Link>
							</Menu.Item>
						);
					})}
				</Menu.Dropdown>
			</Menu>
		) : (
			<Link
				style={{
					color: headerColor,
					backgroundColor: isActive ? hexToRgba(headerColor, 0.15) : '',
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.backgroundColor = hexToRgba(headerColor, 0.15);
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.backgroundColor = isActive
						? hexToRgba(headerColor, 0.15)
						: '';
				}}
				key={index}
				href={modifiedLink}
				className={classes.link}
			>
				{link.label}
			</Link>
		);
	});

	return (
		<header className={headerClass}>
			<Container className={classes.container} size="xl">
				<Box className={classes.inner}>
					{isMobile ? (
						<Group className={classes.headerMobile}>
							<Box className={classes.headerMobileLogoWrap}>
								<Link href={`/${lang}/`} className={classes.logo}>
									<IconLogo fill={headerColor} />
								</Link>
								<Text
									onClick={toggleMenu}
									style={{
										color: headerColor,
										backgroundColor: hexToRgba(headerColor, 0.15),
									}}
									className={classes.burger}
								>
									{isOpenMenu ? 'Stäng' : 'Meny'}
								</Text>
							</Box>
							<Group
								className={`${classes.mobileLinks} ${isOpenMenu ? classes.menuContainerOpen : ''}`}
							>
								<TimeToOpening coloredHeader={headerColor} />
								{renderLinks(links, true)}
							</Group>
						</Group>
					) : (
						<>
							<Link href={`/${lang}/`} className={classes.logo}>
								<IconLogo fill={headerColor} />
							</Link>
							<Group className={classes.links}>{desktopLinks}</Group>
							<TimeToOpening coloredHeader={headerColor} />
						</>
					)}
				</Box>
			</Container>
		</header>
	);
}
