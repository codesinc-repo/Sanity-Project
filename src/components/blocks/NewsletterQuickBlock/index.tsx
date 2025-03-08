'use client';

import { Box, Container, Group, Title } from '@mantine/core';
import axios from 'axios';
import React, { useCallback, useState } from 'react';

import CustomButton from '@/components/Button';
import EmailIcon from '@/components/Icons/EmailIcon';
import InputForms from '@/components/InputForms';
import { useGravityFormsContext } from '@/context/gravityForms.context';
import { generateForm, generateFormsFields } from '@/helpers';
import type { IButtonOptions, IGravityForms } from '@/helpers/global.interface';

import classes from './NewsletterQuickBlock.module.css';

interface NewsletterQuickBlockProps {
	data: {
		hide_this_block: boolean;
		is_first_block: boolean;
		title: string;
		sub_title: string;
		submit_button_repeater: IButtonOptions[];
	};
}

const NewsletterQuickBlock: React.FC<NewsletterQuickBlockProps> = ({
	data: { is_first_block, title, sub_title, hide_this_block, submit_button_repeater },
}) => {
	const { gravityForms } = useGravityFormsContext();
	const [formState, setFormState] = useState({
		confirmationMessage: '',
		isFormLoading: false,
	});

	const currentFormFields = gravityForms.find((item) => item?.title === 'Newsletter Quick form');
	const finalFormsFields = generateFormsFields(currentFormFields as IGravityForms, classes);
	const form = generateForm(finalFormsFields);

	const handleSubmit = useCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			form.validate();

			if (form.isValid() && currentFormFields?.formId) {
				try {
					setFormState((prev) => ({ ...prev, isFormLoading: true }));
					const response = await axios.post('/api/contactUs', {
						body: form.values,
						formId: currentFormFields.formId,
					});

					if (response.status === 200) {
						const { data } = response.data;
						form.reset();
						setFormState({
							confirmationMessage: data?.confirmation_message,
							isFormLoading: false,
						});
						setTimeout(() => {
							setFormState((prev) => ({ ...prev, confirmationMessage: '' }));
						}, 3000);
					}
				} catch (error) {
					setFormState((prev) => ({ ...prev, isFormLoading: false }));
					console.error('Error occurred:', error);
				}
			}
		},
		[currentFormFields, form],
	);

	if (hide_this_block) return null;

	return (
		<Box className={`${classes.newsletterQuick} ${is_first_block ? classes.firstBlock : ''}`}>
			<Container size="xl">
				{title && (
					<Title order={3} className={classes.title}>
						{title}
					</Title>
				)}
				{sub_title && (
					<Box
						className={classes.subTitle}
						dangerouslySetInnerHTML={{ __html: sub_title }}
					/>
				)}
				<form className={classes.form} onSubmit={handleSubmit}>
					<Box className={classes.fields}>
						<Box>
							{(Array.isArray(finalFormsFields) ? finalFormsFields : [])?.map(
								(input, index: number) => (
									<InputForms
										key={index}
										data={input}
										customForm={form}
										classesProps={classes}
										singleIcon={<EmailIcon />}
									/>
								),
							)}
						</Box>

						<Group className={classes.buttonWrap}>
							{submit_button_repeater && (
								<CustomButton
									isSubmitBtn={true}
									button={submit_button_repeater}
									isLoading={formState.isFormLoading}
								/>
							)}
						</Group>
					</Box>
					{formState.confirmationMessage && (
						<Box
							className={classes.confirmationMessage}
							dangerouslySetInnerHTML={{ __html: formState.confirmationMessage }}
						/>
					)}
				</form>
			</Container>
		</Box>
	);
};

export default NewsletterQuickBlock;
