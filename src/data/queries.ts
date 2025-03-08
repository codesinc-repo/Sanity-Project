import { gql } from '@apollo/client';

const themeSettingsFields = `
		robotsTxt
    footerLogo {
        node {
            title
            sourceUrl
        }
    }
    footerDescription {
        title
        format
    }
    footerMenu
    footerMenuLabelsTitle
    footerCopyright
    footerPrivacyLink {
        nodes {
            ... on Page {
                id
                slug
                title
            }
        }
    }
    footerLanguageTitle
    footerMenuThirdContent
    footerProducerad
    footerSocialLinks {
        link
        icon {
            node {
                title
                sourceUrl
            }
        }
    }
    footerCookies {
        nodes {
            ... on Page {
                id
                slug
                title
            }
        }
    }
    frontendLink
    headerButtonRepeater {
        color
        variant
        button {
            title
            url
        }
    }
    cookiesContent
    cookiesButtonRepeater {
        color
        variant
        button {
            title
            url
        }
    }
    preheaderContent
    timeWhenPreheaderClose
    numberOfPosts
    modalTitle
    modalContent
    modalTextAfterButton
    modalButton {
        color
        variant
        text
    }
    modalInputIcon {
        icon {
            node {
                title
                sourceUrl
            }
        }
        inputId
    }
    showTimer
    holidays {
        startHolidays
        endHolidays
        opening
        closing
    }
    weekDays {
        opening
        closing
    }
    saturday {
        opening
        closing
    }
    sunday {
        opening
        closing
    }
`;

export const QUERY_THEME_SETTINGS_EN = gql`
	query ThemeSettings {
		themeGeneralSettingsEN {
			themeSettingsEN {
				${themeSettingsFields}
			}
		}
	}
`;

export const QUERY_THEME_SETTINGS_SV = gql`
	query ThemeSettings {
		themeGeneralSettingsSV {
			themeSettingsSV {   
				${themeSettingsFields}
			}
		}
	}
`;
