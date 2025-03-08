'use client';

import { Box, Container, Group, Image, Title } from '@mantine/core';
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import React, { useState } from 'react';

import classes from '@/components/blocks/LoginFormBlock/LoginFormBlock.module.css';
import CustomButton from '@/components/Button';
import InputForms from '@/components/InputForms';
import { useGravityFormsContext } from '@/context/gravityForms.context';
import { generateForm, generateFormsFields } from '@/helpers';
import type { IButtonOptions, IGravityForms, IImage } from '@/helpers/global.interface';

interface ILoginFormBlockProps {
	data: {
		hide_this_block: string;
		image: IImage;
		is_first_block: boolean;
		title: string;
		sub_title: string;
		submit_button_repeater: IButtonOptions[];
		button_repeater: IButtonOptions[];
	};
	lang: string;
}

const LoginFormBlock: FC<ILoginFormBlockProps> = ({ data, lang }) => {
	const { gravityForms } = useGravityFormsContext();

	const { replace } = useRouter();

	const [confirmationMessage, setConfirmationMessage] = useState('');
	const [isFormLoading, setIsFormLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const currentFormFields = gravityForms.find((item) => item?.title === 'Login form');

	const finalFormsFields = generateFormsFields(
		currentFormFields as IGravityForms,
		classes,
		[],
		true,
	);

	const form = generateForm(finalFormsFields);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		form.validate();
		setErrorMessage('');

		if (form.isValid() && currentFormFields?.formId) {
			try {
				setIsFormLoading(true);
				const response = await axios.post('/api/login-user', {
					body: form.values,
				});

				if (response.status === 200) {
					const { data: loginData } = response.data;

					if (loginData?.token) {
						form.reset();
						setConfirmationMessage(loginData?.message);
						Cookies.set('gottsundaAuthToken', loginData?.token, { expires: 1 });
						replace(`/${lang}/gottsundakalendern/instrumentpanelen/`);
						setIsFormLoading(false);
						setTimeout(() => {
							setConfirmationMessage('');
						}, 3000);
					} else {
						setErrorMessage(loginData?.message);
						setIsFormLoading(false);
					}
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
			className={`${classes.loginFormBlock} ${data?.is_first_block ? classes.firstBlock : ''}`}
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
							{data?.title}
						</Title>
					)}
					{data?.sub_title && (
						<div
							className={`${classes.subTitle}`}
							dangerouslySetInnerHTML={{ __html: data?.sub_title }}
						/>
					)}
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
							{data?.title && (
								<Link
									href={`/${lang}/gottsundakalendern/glomt-losenordet/`}
									className={classes.forgotPassword}
								>
									{'Glöm lösenord'}
								</Link>
							)}
							<Group className={classes.buttonWrap}>
								{data?.submit_button_repeater && (
									<CustomButton
										isSubmitBtn={true}
										isLoading={isFormLoading}
										button={data?.submit_button_repeater}
									/>
								)}
								{data?.button_repeater && (
									<CustomButton button={data?.button_repeater} />
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
				</Box>
			</Container>
		</Box>
	);
};

export default LoginFormBlock;
