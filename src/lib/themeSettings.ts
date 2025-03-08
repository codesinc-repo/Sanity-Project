import { QUERY_THEME_SETTINGS_EN, QUERY_THEME_SETTINGS_SV } from '@/data/queries';

import { getClient } from './apolloClient';

export async function themeSettingsEN() {
	const { data } = await getClient().query({
		query: QUERY_THEME_SETTINGS_EN,
	});
	return data?.themeGeneralSettingsEN?.themeSettingsEN;
}

export async function themeSettingsSV() {
	const { data } = await getClient().query({
		query: QUERY_THEME_SETTINGS_SV,
	});
	return data?.themeGeneralSettingsSV?.themeSettingsSV;
}
