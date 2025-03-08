'use client';

import { Box, Checkbox, Container, Group, rem, SimpleGrid, Text, Title } from '@mantine/core';
import axios from 'axios';
import type { FC } from 'react';
import { memo, useCallback, useState } from 'react';

import CustomButton from '@/components/Button';
import InputForms from '@/components/InputForms';
import { useGravityFormsContext } from '@/context/gravityForms.context';
import { generateForm, generateFormsFields } from '@/helpers';
import type { IButtonOptions, IGravityForms } from '@/helpers/global.interface';

import classes from './ContactUs.module.css';

interface IContactUsProps {
	data: {
		hide_this_block: string;
		is_first_block: boolean;
		title: string;
		contact_form: string;
		sub_title: string;
		description: string;
		checkbox_text: string;
		submit_button_repeater: IButtonOptions[];
	};
}

const ContactUs: FC<IContactUsProps> = ({
	data: {
		is_first_block,
		title,
		hide_this_block,
		contact_form,
		sub_title,
		description,
		submit_button_repeater,
		checkbox_text,
	},
}) => {
	const { gravityForms } = useGravityFormsContext();

	const [checkboxValue, setCheckboxValue] = useState(true);
	const [confirmationMessage, setConfirmationMessage] = useState('');
	const [isFormLoading, setIsFormLoading] = useState(false);

	const currentFormFields = gravityForms.find((item) => item?.formId === +contact_form);
	const finalFormsFields = generateFormsFields(
		currentFormFields as IGravityForms,
		classes,
		[],
		true,
	);

	const form = generateForm(finalFormsFields);

	const handleCheckboxChange = useCallback(() => {
		setCheckboxValue((prevValue) => !prevValue);
	}, []);

	const handleSubmit = useCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			form.validate();

			if (form.isValid() && currentFormFields?.formId) {
				try {
					setIsFormLoading(true);
					const response = await axios.post('/api/contactUs', {
						body: form.values,
						formId: currentFormFields.formId,
					});

					if (response.status === 200) {
						const { data } = response.data;
						form.reset();
						setConfirmationMessage(data?.confirmation_message);
						setIsFormLoading(false);
						setTimeout(() => {
							setConfirmationMessage('');
						}, 3000);
					}
				} catch (error) {
					setIsFormLoading(false);
					console.error('Error occurred:', error);
				}
			}
		},
		[currentFormFields, form],
	);

	if (hide_this_block) {
		return null;
	}

	return (
		<Box className={`${classes.contactUs} ${is_first_block ? classes.firstBlock : ''}`}>
			<Container size={'xl'}>
				<SimpleGrid
					cols={{
						base: 1,
						md: 2,
					}}
					spacing={{
						base: 16,
						sm: 24,
					}}
					className={classes.inner}
				>
					<Box className={classes.content}>
						{title && (
							<Title order={3} className={classes.title}>
								{title}
							</Title>
						)}
						{sub_title && <Text className={classes.subTitle}>{sub_title}</Text>}
						{description && (
							<Box
								className={classes.description}
								dangerouslySetInnerHTML={{ __html: description }}
							/>
						)}
					</Box>
					<form className={classes.form} onSubmit={handleSubmit}>
						<Box className={classes.fields}>
							<Box className={classes.inputsWrap}>
								{(Array.isArray(finalFormsFields) ? finalFormsFields : [])?.map(
									(input, index) => (
										<InputForms
											key={index}
											data={input}
											customForm={form}
											classesProps={classes}
										/>
									),
								)}
							</Box>
							<Box className={classes.checkboxWrap} onClick={handleCheckboxChange}>
								<Checkbox
									checked={checkboxValue}
									onChange={(event) =>
										setCheckboxValue(event.currentTarget.checked)
									}
									size={rem(24)}
									tabIndex={-1}
									color="#685BC7"
									className={classes?.checkbox}
								/>
								{checkbox_text && (
									<Box
										className={classes.checkboxText}
										dangerouslySetInnerHTML={{ __html: checkbox_text }}
									/>
								)}
							</Box>
							<Group className={classes.buttonWrap}>
								{submit_button_repeater && (
									<CustomButton
										isSubmitBtn={true}
										isLoading={isFormLoading}
										checkboxValue={!checkboxValue}
										button={submit_button_repeater}
									/>
								)}
							</Group>
						</Box>
						{confirmationMessage && (
							<Box
								className={classes.confirmationMessage}
								dangerouslySetInnerHTML={{ __html: confirmationMessage }}
							/>
						)}
					</form>
				</SimpleGrid>
			</Container>
		</Box>
	);
};

export default memo(ContactUs);
