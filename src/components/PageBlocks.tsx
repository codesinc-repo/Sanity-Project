import React from 'react';

import { componentImports } from '@/helpers/componentImports';
import type { IEventsCategories, IEventsPosts } from '@/helpers/global.interface';

import type { Locale } from '../../i18n-config';
import Error404 from './Error404';

interface Blocks {
	blocks: {
		blockName: string;
		blockData: Record<string, unknown>;
	}[];
	lang: Locale;
	eventsPosts?: IEventsPosts;
	eventsCategories?: IEventsCategories[];
}

const PageBlocks = async ({ blocks, lang, eventsPosts, eventsCategories }: Blocks) => {
	const filteredBlocks = blocks?.filter(
		(item) => componentImports[item?.blockName] !== undefined,
	);

	return (
		<>
			{filteredBlocks?.map((item, index: number) => {
				const DynamicComponent = componentImports[item?.blockName];
				return (
					<DynamicComponent
						key={index}
						lang={lang}
						eventsPosts={eventsPosts}
						eventsCategories={eventsCategories}
						data={item?.blockData}
					/>
				);
			})}

			{!filteredBlocks?.length && <Error404 />}
		</>
	);
};

export default PageBlocks;
