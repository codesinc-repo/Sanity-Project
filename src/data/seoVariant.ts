import { gql } from '@apollo/client';

export const SEO_VARIANT_EN = gql`
	query ThemeSettings {
		themeGeneralSettingsEN {
			themeSettingsEN {
				seoVariant
			}
		}
	}
`;

export const SEO_VARIANT_SV = gql`
	query ThemeSettings {
		themeGeneralSettingsSV {
			themeSettingsSV {
				seoVariant
			}
		}
	}
`;
