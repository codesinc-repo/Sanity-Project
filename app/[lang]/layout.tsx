import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './globalStyle.css';

import { MantineProvider } from '@mantine/core';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Archivo } from 'next/font/google';
import localFont from 'next/font/local';
import Script from 'next/script';
import React, { cache } from 'react';

import CookiesBlock from '@/components/CookiesBlock';
import PreheaderBlock from '@/components/PreheaderBlock';
import { GravityFormsContextProvider } from '@/context/gravityForms.context';
import { ThemeContextProvider } from '@/context/theme.context';
import { theme } from '@/helpers/mantineTheme';
import { gravityFormsSettings } from '@/lib/gravityFormsOptions';
import { themeSettingsEN, themeSettingsSV } from '@/lib/themeSettings';

import type { Locale } from '../../i18n-config';
import { i18n } from '../../i18n-config';

// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 60;

// We'll prerender only the params from generateStaticParams at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true; // or false, to 404 on unknown paths

// If loading a variable font, you don't need to specify the font weight
const archivo = Archivo({
	subsets: ['latin'],
	style: ['normal'],
	weight: ['400', '600', '700'],
	variable: '--font-archivo',
	display: 'swap',
});

const monumentExtended = localFont({
	src: './fonts/MonumentExtended-Regular.otf',
	weight: '400',
	display: 'swap',
	variable: '--font-monument',
});

export async function generateStaticParams() {
	return i18n.locales.map((locale) => ({ lang: locale }));
}

const getThemeSettings = cache(async (lang: Locale) => {
	const themeSetting = await (lang === 'en' ? themeSettingsEN() : themeSettingsSV());
	const gravityForms = await gravityFormsSettings();

	return { themeSetting, gravityForms };
});

export default async function RootLayout({
	children,
	params,
}: {
	children: any;
	params: { lang: Locale };
}) {
	const { themeSetting, gravityForms } = await getThemeSettings(params.lang);

	return (
		<html lang={params.lang} className={`${archivo.variable} ${monumentExtended.variable}`}>
			<head>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
				/>
				<meta name="theme-color" content="#F3F0FF" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<link rel="icon" type="image/png" href="/favicon.ico" sizes="any" />

				<Script
					id="gtm-init"
					strategy="afterInteractive"
					dangerouslySetInnerHTML={{
						__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
						new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
						j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
						'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
						})(window,document,'script','dataLayer','GTM-59LSNSZ5');`,
					}}
				/>
			</head>
			<body style={{ height: 'auto', backgroundColor: '#ffffff' }}>
				<ThemeContextProvider value={themeSetting}>
					<GravityFormsContextProvider value={gravityForms}>
						<MantineProvider theme={theme}>
							<PreheaderBlock />
							{children}
							<CookiesBlock lang={params.lang} />
						</MantineProvider>
					</GravityFormsContextProvider>
				</ThemeContextProvider>
			</body>
			<GoogleAnalytics gaId="G-3ZC1QWDPL9" />
		</html>
	);
}
