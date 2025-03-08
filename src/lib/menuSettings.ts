import { QUERY_MENUS } from '@/data/menus';

import { getClient } from './apolloClient';

interface MenuObject {
	link: string;
	label: string;
	links?: MenuObject[];
}

interface MenuItem {
	label: string;
	parentId: string;
	path: string;
	childItems: {
		nodes: {
			label: string;
			path: string;
		}[];
	};
}

interface Menu {
	name: string;
	slug: string;
	menuItems: {
		nodes: MenuItem[];
	};
}

interface MenuProps {
	[menuName: string]: MenuObject[];
}

export async function menuSettings() {
	const { data } = await getClient().query({
		query: QUERY_MENUS,
	});

	const menus = data?.menus?.nodes;
	const menuObjects: MenuProps = {};

	menus?.forEach((menu: Menu) => {
		const { slug: menuName, menuItems } = menu;

		if (menuName && menuItems?.nodes) {
			const menuObjectArray: MenuObject[] = [];

			menuItems.nodes.forEach((menuItem) => {
				const { parentId, path, label, childItems } = menuItem;

				if (!parentId && childItems.nodes) {
					const links = childItems.nodes.map(({ path: childUrl, label: childLabel }) => ({
						link: childUrl,
						label: childLabel,
					}));

					const menuObject: MenuObject = {
						link: path,
						label,
					};

					if (links.length > 0) {
						menuObject.links = links;
					}

					menuObjectArray.push(menuObject);
				}
			});

			menuObjects[menuName] = menuObjectArray;
		}
	});

	return menuObjects;
}
