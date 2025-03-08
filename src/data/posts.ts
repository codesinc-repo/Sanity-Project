import { gql } from '@apollo/client';

const postCommonFields = `
		slug
		title
		postId
		author {
			node {
				name
			}
		}
		categories {
			nodes {
				categoryId
				name
				slug
			}
		}
		excerpt
		featuredImage {
			node {
				title
				sourceUrl
			}
		}
		date
		blocks {
			blockData
			blockName
		}
`;

export const QUERY_POST_BY_ID_WITH_RANK_MATH_SEO = gql`
	query Post($postId: Int!) {
		postBy(postId: $postId) {
			${postCommonFields}
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
export const QUERY_POST_BY_ID_WITH_YOAST_SEO = gql`
	query Post($postId: Int!) {
		postBy(postId: $postId) {
			${postCommonFields}
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
