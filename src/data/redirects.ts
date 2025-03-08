import { gql } from '@apollo/client';

export const QUERY_THEME_REDIRECTS = gql`
	query ThemeRedirects {
		themeRedirects {
			themeGeneralRedirects {
				redirects {
					to
					statusCode
					from
				}
			}
		}
	}
`;
