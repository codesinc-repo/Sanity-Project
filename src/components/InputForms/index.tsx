'use client';

import { Box, Checkbox, Group, Radio, Select, Textarea, TextInput } from '@mantine/core';
import React, { useState } from 'react';

import HidePasswordIcon from '@/components/Icons/HidePasswordIcon';
import IconRadio from '@/components/Icons/IconRadio';
import SelectIcon from '@/components/Icons/SelectIcon';
import ShowPasswordIcon from '@/components/Icons/ShowPasswordIcon';
import classes from '@/components/InputForms/InputForms.module.css';
import type { IFormFields } from '@/helpers/global.interface';

import Svg from '../Svg';

interface InputForms {
	data: IFormFields;
	customForm?: any;
	classesProps?: any;
	singleIcon?: any;
}

const CustomInputForms = ({ data, customForm, classesProps, singleIcon }: InputForms) => {
	const inputWrapClass = data?.size === 'MEDIUM' ? classesProps.medium : classesProps.large;
	const [showPassword, setShowPassword] = useState(false);

	/**
	 * Toggle password visibility
	 */
	const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

	/**
	 * Define what type of input should be rendered
	 * @param param<FormFields>
	 * @param form
	 * @param icon
	 * @return {*}
	 */
	const renderSwitch = (param: IFormFields, form: any, icon: any) => {
		const inputProps = form ? { ...form.getInputProps(`${param?.name}`) } : '';

		switch (param?.type) {
			case 'TEXT':
			case 'EMAIL':
			case 'PHONE':
				return (
					<TextInput
						className={`${classes?.fieldInput} ${param.className}`}
						label={param?.label}
						name={param?.name}
						placeholder={param?.placeholder}
						withAsterisk={param?.isRequired}
						autoComplete={'off'}
						type={param?.isPasswordInput && !showPassword ? 'password' : 'text'}
						leftSection={
							icon ||
							(param?.icon && <Svg svg={param?.icon} width={24} height={24} />)
						}
						rightSection={
							param?.isPasswordInput && (
								<Group
									onClick={togglePasswordVisibility}
									aria-label="Toggle password visibility"
								>
									{showPassword ? <HidePasswordIcon /> : <ShowPasswordIcon />}
								</Group>
							)
						}
						styles={(theme) => ({
							section: {
								margin: 0,
								'--_section-size': 'initial',
								paddingLeft: !param?.isPasswordInput ? 16 : 0,
								paddingRight: param?.isPasswordInput ? 16 : 0,
							},
							error: {
								fontSize: theme.fontSizes.md,
							},
						})}
						{...inputProps}
					/>
				);

			case 'SELECT':
				return (
					<Select
						className={`${classes?.fieldInput} ${param.className}`}
						placeholder={param?.placeholder}
						checkIconPosition="right"
						label={param?.label}
						name={param?.name}
						// @ts-ignore
						data={param?.choices ?? []}
						defaultValue={param?.defaultValue || ''}
						rightSection={<SelectIcon />}
						withAsterisk={param?.isRequired}
						styles={(theme) => ({
							dropdown: {
								backgroundColor: '#ffffff',
								border: '1px solid #685BC7',
							},
							error: {
								fontSize: theme.fontSizes.md,
							},
						})}
						{...inputProps}
					/>
				);

			case 'POST_EXCERPT':
				return (
					<Textarea
						className={`${classes?.fieldInput} ${param.className}`}
						label={param?.label}
						name={param?.name}
						placeholder={param?.placeholder}
						minRows={4}
						withAsterisk={param?.isRequired}
						leftSection={<Svg svg={param?.icon} width={24} height={24} />}
						styles={(theme) => ({
							section: {
								margin: 0,
								'--_section-size': 'initial',
								paddingLeft: 16,
								paddingTop: 16,
								paddingRight: 16,
								alignItems: 'flex-start',
							},
							error: {
								fontSize: theme.fontSizes.md,
							},
						})}
						{...inputProps}
					/>
				);

			case 'CHECKBOX':
				return (
					<Checkbox
						className={`${classes?.fieldInput} ${param.className}`}
						label={param?.label}
						name={param?.name}
						withAsterisk={param?.isRequired}
						styles={(theme) => ({
							label: {
								fontWeight: 500,
							},
							error: {
								fontSize: theme.fontSizes.md,
							},
						})}
						{...inputProps}
					/>
				);
			case 'MULTI_SELECT':
				return (
					<Checkbox.Group
						className={` ${param.className}`}
						classNames={{
							label: classes.radioWrapperLabel,
						}}
						label={param?.label}
						name={param?.name}
						withAsterisk={param?.isRequired}
						styles={(theme) => ({
							label: {
								fontWeight: 500,
							},
							error: {
								fontSize: theme.fontSizes.md,
							},
						})}
						{...inputProps}
					>
						<Group className={classes.multiCheckboxGroup}>
							{param?.choices?.map((choice: any) => (
								<Checkbox
									key={choice.value}
									value={choice.value}
									classNames={{
										root: classes.radioRoot,
										inner: classes.radioInner,
										label: classes.radioLabel,
										input: classes.radioInput,
										body: classes.radioBody,
									}}
									icon={() => <IconRadio />}
									label={choice.text}
								/>
							))}
						</Group>
					</Checkbox.Group>
				);
			case 'RADIO':
				return (
					<Radio.Group
						className={` ${param.className}`}
						classNames={{
							label: classes.radioWrapperLabel,
						}}
						label={param?.label}
						name={param?.name}
						withAsterisk={param?.isRequired}
						{...inputProps}
					>
						<Group className={classes.radioGroup}>
							{param?.choices?.map((choice: any) => (
								<Radio
									key={choice.value}
									value={choice.value}
									classNames={{
										root: classes.radioRoot,
										inner: classes.radioInner,
										label: classes.radioLabel,
										radio: classes.radioInput,
										body: classes.radioBody,
									}}
									icon={() => <IconRadio />}
									label={choice.text}
								/>
							))}
						</Group>
					</Radio.Group>
				);

			default:
				return null;
		}
	};

	return <Box className={inputWrapClass}>{renderSwitch(data, customForm, singleIcon)}</Box>;
};

export default CustomInputForms;
