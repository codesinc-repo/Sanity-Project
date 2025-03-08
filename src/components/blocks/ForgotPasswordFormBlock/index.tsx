'use client';

import { Box, Container, Group, Image, Text, Title } from '@mantine/core';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FC } from 'react';
import React, { useState } from 'react';

import classes from '@/components/blocks/ForgotPasswordFormBlock/ForgotPasswordFormBlock.module.css';
import CustomButton from '@/components/Button';
import InputForms from '@/components/InputForms';
import { useGravityFormsContext } from '@/context/gravityForms.context';
import { generateForm, generateFormsFields } from '@/helpers';
import type { IButtonOptions, IGravityForms, IImage } from '@/helpers/global.interface';

interface IForgotPasswordFormBlockProps {
	data: {
		hide_this_block: string;
		image: IImage;
		is_first_block: boolean;
		title: string;
		after_register_title: string;
		after_register_sub_title: string;
		sub_title: string;
		submit_button_repeater: IButtonOptions[];
		button_repeater: IButtonOptions[];
	};
	lang: string;
}

const ForgotPasswordFormBlock: FC<IForgotPasswordFormBlockProps> = ({ data, lang }) => {
	const { gravityForms } = useGravityFormsContext();

	const { replace } = useRouter();

	const searchParams = useSearchParams();
	const activationResetPass = searchParams.get('activation_reset_pass');
	const userEmail = searchParams.get('email');

	const [isFormSend, setIsFormSend] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [isFormLoading, setIsFormLoading] = useState(false);
	const [confirmationMessage, setConfirmationMessage] = useState('');

	const currentFormFields = gravityForms.find((item) => item?.title === 'Forgot password form');
	const currentSecondFormFields = gravityForms.find(
		(item) => item?.title === 'New password form',
	);

	const finalFormsFields = generateFormsFields(
		currentFormFields as IGravityForms,
		classes,
		[],
		true,
	);
	const finalSecondFormsFields = generateFormsFields(
		currentSecondFormFields as IGravityForms,
		classes,
		[],
		true,
	);

	const form = generateForm(finalFormsFields);
	const formSecond = generateForm(finalSecondFormsFields);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		form.validate();
		setErrorMessage('');

		if (form.isValid() && currentFormFields?.formId) {
			setIsFormLoading(true);
			try {
				const response = await axios.post('/api/forgot-password', {
					body: form.values,
					lang,
				});

				if (response) {
					const { data: forgotData } = response.data;

					if (forgotData?.status === 200) {
						setIsFormSend(true);
					} else {
						setErrorMessage(forgotData?.message);
					}
					setIsFormLoading(false);
				}
			} catch (error) {
				setIsFormLoading(false);
				console.error('Error occurred:', error);
			}
		}
	};

	const handleNewPassSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		formSecond.validate();
		setErrorMessage('');

		if (formSecond.isValid()) {
			try {
				const response = await axios.post('/api/new-password', {
					body: {
						userEmail,
						newPassword: formSecond.values?.input_29,
						repeatNewPassword: formSecond.values?.input_30,
						hash: activationResetPass,
					},
				});

				if (response) {
					const { data: newPassData } = response.data;

					if (newPassData?.status === 200) {
						setConfirmationMessage(newPassData?.message);

						replace(`/${lang}/gottsundakalendern/inloggning`);
					} else {
						setErrorMessage(newPassData?.message);
					}
				}
			} catch (error) {
				console.error('Error occurred:', error);
			}
		}
	};

	if (data?.hide_this_block) {
		return null;
	}

	return (
		<Box
			className={`${classes.forgotPasswordFormBlock} ${data?.is_first_block ? classes.firstBlock : ''}`}
		>
			<Container size="xl" className={classes.container}>
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
					{(data?.sub_title || data?.after_register_sub_title) && (
						<Text className={`${classes.subTitle}`}>
							{isFormSend ? data?.after_register_sub_title : data?.sub_title}
						</Text>
					)}
					{!isFormSend && !userEmail && !activationResetPass && (
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
								<Group className={classes.buttonWrap}>
									{data?.submit_button_repeater[0] && (
										<CustomButton
											isSubmitBtn={true}
											button={[data?.submit_button_repeater[0]]}
											isLoading={isFormLoading}
										/>
									)}
								</Group>
							</Box>

							{errorMessage && (
								<Box
									className={classes.errorMessage}
									dangerouslySetInnerHTML={{ __html: errorMessage }}
								/>
							)}
						</form>
					)}
					{!isFormSend && userEmail && activationResetPass && (
						<form className={classes.form} onSubmit={handleNewPassSubmit}>
							<Box className={classes.fields}>
								<Box className={classes.inputsWrap}>
									{(Array.isArray(finalSecondFormsFields)
										? finalSecondFormsFields
										: []
									)?.map((input, index: number) => {
										return (
											<InputForms
												key={index}
												data={input}
												customForm={formSecond}
												classesProps={classes}
											/>
										);
									})}
								</Box>
								<Group className={classes.buttonWrap}>
									{data?.submit_button_repeater[1] && (
										<CustomButton
											isSubmitBtn={true}
											button={[data?.submit_button_repeater[1]]}
											isLoading={isFormLoading}
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

					{isFormSend && data?.button_repeater && (
						<Group className={classes.buttonWrap}>
							<CustomButton button={data?.button_repeater} />
						</Group>
					)}
				</Box>
			</Container>
		</Box>
	);
};

export default ForgotPasswordFormBlock;
