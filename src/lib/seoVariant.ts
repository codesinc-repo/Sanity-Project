import { SEO_VARIANT_EN, SEO_VARIANT_SV } from '@/data/seoVariant';

import { getClient } from './apolloClient';

export async function seoVariantEN() {
	const { data } = await getClient().query({
		query: SEO_VARIANT_EN,
	});
	return data?.themeGeneralSettingsEN?.themeSettingsEN?.seoVariant;
}

export async function seoVariantSV() {
	const { data } = await getClient().query({
		query: SEO_VARIANT_SV,
	});
	return data?.themeGeneralSettingsSV?.themeSettingsSV?.seoVariant;
}
