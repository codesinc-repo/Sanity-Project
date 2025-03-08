'use client';

import type { Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useState } from 'react';

import type { IButtonOptions, IImageTS, IInputIcon } from '@/helpers/global.interface';

interface ThemeSettings {
	robotsTxt: string;
	footerLogo: IImageTS;
	footerDescription: {
		title: string;
		format: boolean;
	}[];
	footerMenu: string;
	footerMenuLabelsTitle: string;
	footerCopyright: string;
	footerPrivacyLink: {
		nodes: {
			id: string;
			slug: string;
			title: string;
		}[];
	};
	footerLanguageTitle: string;
	footerMenuThirdContent: string;
	footerProducerad: string;
	footerSocialLinks: {
		link: string;
		icon: IImageTS;
	}[];
	footerCookies: {
		nodes: {
			id: string;
			slug: string;
			title: string;
		}[];
	};
	frontendLink: string;
	headerLogo: IImageTS;
	headerLogoMobile: IImageTS;
	headerLogoColored: IImageTS;
	headerLogoMobileColored: IImageTS;
	headerButtonRepeater: IButtonOptions[];
	cookiesContent: string;
	cookiesButtonRepeater: IButtonOptions[];
	preheaderContent: string;
	timeWhenPreheaderClose: string;
	numberOfPosts: string;
	modalTitle: string;
	modalContent: string;
	modalTextAfterButton: string;
	showTimer: string;
	holidays: {
		startHolidays: string;
		endHolidays: string;
		opening: string;
		closing: string;
	}[];
	weekDays: {
		opening: string;
		closing: string;
	};
	saturday: {
		opening: string;
		closing: string;
	};
	sunday: {
		opening: string;
		closing: string;
	};
	modalButton: IButtonOptions[];
	modalInputIcon: IInputIcon[];
}

interface ThemeContextProps {
	themeSettings: ThemeSettings;
	setThemeSettings: Dispatch<SetStateAction<ThemeSettings>>;
}

const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

export const ThemeContextProvider = ({
	children,
	value,
}: {
	children: React.ReactNode;
	value: any;
}) => {
	const [themeSettings, setThemeSettings] = useState(value);

	return (
		<ThemeContext.Provider
			value={{
				themeSettings,
				setThemeSettings,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
};

export const useThemeContext = () => useContext(ThemeContext);
