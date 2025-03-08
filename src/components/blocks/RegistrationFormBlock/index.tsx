'use client';

import { Box, Checkbox, Container, Group, Image, rem, Text, Title } from '@mantine/core';
import axios from 'axios';
import type { FC } from 'react';
import React, { useState } from 'react';

import classes from '@/components/blocks/RegistrationFormBlock/RegistrationFormBlock.module.css';
import CustomButton from '@/components/Button';
import InputForms from '@/components/InputForms';
import { useGravityFormsContext } from '@/context/gravityForms.context';
import { generateForm, generateFormsFields } from '@/helpers';
import type { IButtonOptions, IGravityForms, IImage } from '@/helpers/global.interface';

import type { Locale } from '../../../../i18n-config';

interface IRegistrationFormBlockProps {
	data: {
		checkbox_text: string;
		hide_this_block: string;
		image: IImage;
		is_first_block: boolean;
		title: string;
		after_register_title: string;
		sub_title: string;
		after_register_sub_title: string;
		submit_button_repeater: IButtonOptions[];
		button_repeater: IButtonOptions[];
	};
	lang: Locale;
}

const RegistrationFormBlock: FC<IRegistrationFormBlockProps> = ({ data, lang }) => {
	const { gravityForms } = useGravityFormsContext();

	const [checkboxValue, setCheckboxValue] = useState(true);
	const [isFormSend, setIsFormSend] = useState(false);
	const [isFormLoading, setIsFormLoading] = useState(false);
	const [confirmationMessage, setConfirmationMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const currentFormFields = gravityForms.find((item) => item?.title === 'Registration form');

	const finalFormsFields = generateFormsFields(
		currentFormFields as IGravityForms,
		classes,
		[],
		true,
	);

	const form = generateForm(finalFormsFields);

	const handleCheckboxChange = () => {
		setCheckboxValue((prevValue) => !prevValue);
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		form.validate();
		setErrorMessage('');

		if (form.isValid() && currentFormFields?.formId) {
			try {
				setIsFormLoading(true);
				const response = await axios.post('/api/register-user', {
					body: form.values,
					lang,
				});

				if (response.status === 200) {
					const { data: registrationData } = response.data;

					if (registrationData?.code === 'user_exists') {
						setErrorMessage(registrationData?.message);
					} else {
						form.reset();
						setIsFormSend(true);
						setConfirmationMessage(registrationData?.message);
						setTimeout(() => {
							setConfirmationMessage('');
						}, 3000);
					}
					setIsFormLoading(false);
				}
			} catch (error) {
				setIsFormLoading(false);
				console.error('Error occurred:', error);
			}
		}
	};

	if (data?.hide_this_block) {
		return null;
	}

	return (
		<Box
			className={`${classes.registrationFormBlock} ${data?.is_first_block ? classes.firstBlock : ''}`}
		>
			<Container size="xl">
				{data?.image && (
					<Image
						loading={'lazy'}
						src={data?.image?.url}
						alt={data?.image?.title}
						className={`${classes.imageMask}`}
					/>
				)}
				<Box className={`${classes.content}`}>
					{data?.title && (
						<Title order={3} className={classes.title}>
							{isFormSend ? data?.after_register_title : data?.title}
						</Title>
					)}
					{data?.sub_title && (
						<Text className={`${classes.subTitle}`}>
							{isFormSend ? data?.after_register_sub_title : data?.sub_title}
						</Text>
					)}
					{!isFormSend && (
						<form className={classes.form} onSubmit={handleSubmit}>
							<Box className={classes.fields}>
								<Box className={classes.inputsWrap}>
									{(Array.isArray(finalFormsFields) ? finalFormsFields : [])?.map(
										(input, index: number) => {
											return (
												<InputForms
													key={index}
													data={input}
													customForm={form}
													classesProps={classes}
												/>
											);
										},
									)}
								</Box>
								<Box
									className={classes.checkboxWrap}
									onClick={handleCheckboxChange}
								>
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
									{data?.checkbox_text && (
										<Box
											className={classes.checkboxText}
											dangerouslySetInnerHTML={{
												__html: data?.checkbox_text,
											}}
										/>
									)}
								</Box>
								<Group className={classes.buttonWrap}>
									{data?.submit_button_repeater && (
										<CustomButton
											isSubmitBtn={true}
											checkboxValue={!checkboxValue}
											isLoading={isFormLoading}
											button={data?.submit_button_repeater}
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
							{errorMessage && (
								<Box
									className={classes.errorMessage}
									dangerouslySetInnerHTML={{ __html: errorMessage }}
								/>
							)}
						</form>
					)}
					{data?.button_repeater && isFormSend && (
						<Group className={classes.buttonWrap}>
							<CustomButton button={data?.button_repeater} />
						</Group>
					)}
				</Box>
			</Container>
		</Box>
	);
};

export default RegistrationFormBlock;
