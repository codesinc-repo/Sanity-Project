import { gql } from '@apollo/client';

export const QUERY_GRAVITY_FORMS = gql`
	query GravityForms {
		gfForms {
			nodes {
				formId
				title
				formFields {
					nodes {
						... on EmailField {
							id
							isRequired
							label
							placeholder
							type
							size
						}
						... on NumberField {
							id
							isRequired
							label
							placeholder
							type
							size
						}
						... on PhoneField {
							id
							isRequired
							label
							placeholder
							type
							size
						}
						... on TextField {
							id
							isRequired
							label
							placeholder
							type
							size
							isPasswordInput
						}
						... on PostExcerptField {
							id
							isRequired
							label
							placeholder
							type
							size
						}
						... on SelectField {
							id
							isRequired
							label
							placeholder
							type
							size
							choices {
								value
								text
							}
						}
					}
				}
			}
		}
	}
`;
