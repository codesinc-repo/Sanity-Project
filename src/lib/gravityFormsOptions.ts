import { QUERY_GRAVITY_FORMS } from '@/data/gravityForms';

import { getClient } from './apolloClient';

export async function gravityFormsSettings() {
	const { data } = await getClient().query({
		query: QUERY_GRAVITY_FORMS,
	});
	return data?.gfForms?.nodes;
}
