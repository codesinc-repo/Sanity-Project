import { gql } from '@apollo/client';

export const QUERY_MENUS = gql`
	query Menus {
		menus {
			nodes {
				name
				slug
				menuItems {
					nodes {
						label
						parentId
						path
						childItems {
							nodes {
								path
								label
							}
						}
					}
				}
			}
		}
	}
`;
