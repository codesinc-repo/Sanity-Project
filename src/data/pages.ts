import { gql } from '@apollo/client';

export const QUERY_PAGE_BY_SLUG_WITH_RANK_MATH_SEO = gql`
	query PageBySlug($variablesSlug: String!) {
		pageBy(uri: $variablesSlug) {
			uri
			slug
			title
			pageId
			pageOptions {
				headerBackground
			}
			blocks {
				blockData
				blockName
			}
			rankMathRobots
			seo {
				description
				canonicalUrl
				title
				focusKeywords
				openGraph {
					description
					url
					title
					image {
						height
						url
						width
					}
				}
				jsonLd {
					raw
				}
			}
		}
	}
`;

export const QUERY_PAGE_BY_SLUG_WITH_YOAST_SEO = gql`
	query PageBySlug($variablesSlug: String!) {
		pageBy(uri: $variablesSlug) {
			uri
			slug
			title
			pageId
			pageOptions {
				headerBackground
			}
			blocks {
				blockData
				blockName
			}
			yoastRobots
			seo {
				canonical
				title
				metaDesc
				focuskw
				opengraphDescription
				opengraphTitle
				opengraphUrl
				opengraphImage {
					sourceUrl
					mediaDetails {
						width
						height
					}
				}
				schema {
					raw
				}
			}
		}
	}
`;
