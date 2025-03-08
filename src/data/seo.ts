import { gql } from '@apollo/client';

export const QUERY_POSTS_AND_PAGES_SEO = gql`
	query SeoPages {
		pages(first: 200) {
			nodes {
				uri
				modified
			}
		}
		posts(first: 200) {
			nodes {
				uri
				modified
			}
		}
	}
`;
