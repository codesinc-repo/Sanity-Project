'use client';

import {
	Accordion,
	Box,
	Button,
	Container,
	Group,
	Image,
	Switch,
	Text,
	Title,
} from '@mantine/core';
import { DateInput, DatePicker, TimeInput } from '@mantine/dates';
import axios from 'axios';
import { formatDate } from 'date-fns';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';

import classes from '@/components/blocks/EventFormBlock/EventFormBlock.module.css';
import IconLoading from '@/components/Icons/IconLoading';
import IconMedia from '@/components/Icons/IconMedia';
import IconRemove from '@/components/Icons/IconRemove';
import InputForms from '@/components/InputForms';
import {
	areDatesEqual,
	formatDateRange,
	formatSingleDate,
	generateForm,
	generateFormsFields,
} from '@/helpers';
import type { IEventFormSteps, IEventsCategories, IGravityForms } from '@/helpers/global.interface';

interface IEventFormBlockProps {
	data: {
		hide_this_block: string;
		is_first_block: boolean;
		title: string;
		sub_title: string;
		form_steps: IEventFormSteps;
	};
	eventsCategories: IEventsCategories[];
	lang: string;
}

interface TimeRange {
	start: string;
	end: string;
}

const EventFormBlock: FC<IEventFormBlockProps> = ({ data, eventsCategories, lang }) => {
	const router = useRouter();

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const [confirmationMessage, setConfirmationMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [timeError, setTimeError] = useState<Record<string, string>>({});
	const [isFormLoading, setIsFormLoading] = useState(false);

	const [activeStep, setActiveStep] = useState<string>('first');

	const [checked, setChecked] = useState(true);
	const [selectedDate, setSelectedDate] = useState<[Date | null, Date | null]>([null, null]);
	const [endingDate, setEndingDate] = useState<Date | null>(null);
	const [timeByDate, setTimeByDate] = useState<Record<string, TimeRange>>({});

	const [isHideEnding, setIsHideEnding] = useState(true);
	const [isHideEndingSecond, setIsHideEndingSecond] = useState(true);

	const formatDateRangeArray = formatDateRange(selectedDate);
	const formatEndingDate = formatSingleDate(endingDate);

	const firstFields = {
		formFields: {
			nodes: [
				{
					id: 31,
					isRequired: data?.form_steps?.first_step?.activity_name_field?.is_required,
					label: data?.form_steps?.first_step?.activity_name_field?.label,
					placeholder: data?.form_steps?.first_step?.activity_name_field?.placeholder,
					size: 'LARGE',
					type: 'TEXT',
				},
				{
					id: 32,
					isRequired: data?.form_steps?.first_step?.description_field?.is_required,
					label: data?.form_steps?.first_step?.description_field?.label,
					placeholder: data?.form_steps?.first_step?.description_field?.placeholder,
					size: 'LARGE',
					type: 'POST_EXCERPT',
				},
				{
					id: 33,
					isRequired: data?.form_steps?.first_step?.select_category_field?.is_required,
					label: data?.form_steps?.first_step?.select_category_field?.label,
					type: 'MULTI_SELECT',
					choices: eventsCategories?.map((eventsCategory) => ({
						value: `${eventsCategory.id}`,
						text: eventsCategory.name,
					})),
				},
				{
					id: 34,
					isRequired: data?.form_steps?.first_step?.organiserplace_field?.is_required,
					label: data?.form_steps?.first_step?.organiserplace_field?.label,
					placeholder: data?.form_steps?.first_step?.organiserplace_field?.placeholder,
					size: 'MEDIUM',
					type: 'TEXT',
				},
				{
					id: 35,
					isRequired: data?.form_steps?.first_step?.contact_person_field?.is_required,
					label: data?.form_steps?.first_step?.contact_person_field?.label,
					placeholder: data?.form_steps?.first_step?.contact_person_field?.placeholder,
					size: 'MEDIUM',
					type: 'TEXT',
				},
				{
					id: 36,
					isRequired: data?.form_steps?.first_step?.phone_number_field?.is_required,
					label: data?.form_steps?.first_step?.phone_number_field?.label,
					placeholder: data?.form_steps?.first_step?.phone_number_field?.placeholder,
					size: 'MEDIUM',
					type: 'PHONE',
				},
				{
					id: 37,
					isRequired: data?.form_steps?.first_step?.email_address_field?.is_required,
					label: data?.form_steps?.first_step?.email_address_field?.label,
					placeholder: data?.form_steps?.first_step?.email_address_field?.placeholder,
					size: 'MEDIUM',
					type: 'EMAIL',
				},
				{
					id: 38,
					isRequired: data?.form_steps?.first_step?.address_field?.is_required,
					label: data?.form_steps?.first_step?.address_field?.label,
					placeholder: data?.form_steps?.first_step?.address_field?.label,
					size: 'LARGE',
					type: 'TEXT',
				},
			],
		},
	};

	const secondFields = {
		formFields: {
			nodes: [
				{
					id: 40,
					label: data?.form_steps?.second_step?.time_block?.recurring_event?.label,
					defaultValue: 'aldrig',
					choices: areDatesEqual(selectedDate[0], selectedDate[1])
						? data?.form_steps?.second_step?.time_block?.recurring_event?.options
						: data?.form_steps?.second_step?.time_block?.recurring_event?.options?.filter(
								(_, index) => index !== 1,
							),
					size: 'LARGE',
					type: 'SELECT',
				},
				{
					id: 41,
					label: data?.form_steps?.second_step?.time_block?.ending?.label,
					defaultValue: 'aldrig',
					choices: data?.form_steps?.second_step?.time_block?.ending?.options,
					size: 'MEDIUM',
					type: 'SELECT',
					className: isHideEnding ? classes.hide : '',
				},
				{
					id: 42,
					label: data?.form_steps?.second_step?.time_block?.number_of_repetitions?.label,
					choices: Array.from(
						{
							length: data?.form_steps?.second_step?.time_block?.number_of_repetitions
								?.count,
						},
						(_, i) => (i + 1).toString(),
					),
					size: 'MEDIUM',
					type: 'SELECT',
					className: isHideEndingSecond ? classes.hide : '',
				},
			],
		},
	};

	const finalFormsFields = generateFormsFields(firstFields as IGravityForms, classes, [], true);
	const secondFinalFormsFields = generateFormsFields(
		secondFields as IGravityForms,
		classes,
		[],
		true,
	);

	const form = generateForm(
		[...finalFormsFields, ...secondFinalFormsFields],
		data?.form_steps,
		true,
	);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setErrorMessage('');
		setConfirmationMessage('');

		if (!form.values) return;

		const formData = new FormData();
		formData.append('title', form.values?.input_31 || '');
		formData.append('description', form.values?.input_32 || '');
		formData.append('category', form.values?.input_33 || '');
		formData.append('location', form.values?.input_34 || '');
		formData.append('contact_person', form.values?.input_35 || '');
		formData.append('phone', form.values?.input_36 || '');
		formData.append('email', form.values?.input_37 || '');
		formData.append('address', form.values?.input_38 || '');
		formData.append('recurring_event', form.values?.input_40 || '');
		formData.append('ending', form.values?.input_41 || '');
		formData.append('number_of_repetitions', form.values?.input_42 || '');
		formData.append('ending_date', formatEndingDate || '');
		formData.append('dates', JSON.stringify(timeByDate) || '');
		formData.append('image', selectedImage || '');
		formData.append('lang', lang);

		try {
			// Send form data to the backend
			setIsFormLoading(true);
			const response = await axios.post('/api/create-event', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			if (response.status === 200) {
				setConfirmationMessage('Aktiviteten har skickats in!');
				router.push(`/${lang}/gottsundakalendern/instrumentpanelen/?afterSubmit=true`);
				setIsFormLoading(false);
			} else {
				setErrorMessage('Ett fel uppstod. Vänligen försök igen.');
				setIsFormLoading(false);
			}
		} catch (error) {
			console.error(error);
			setIsFormLoading(false);
			setErrorMessage('Ett fel uppstod. Vänligen försök igen.');
		}
	};

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			if (!file.type.startsWith('image/')) {
				setErrorMessage('Endast bilder (JPG, PNG eller WebP) är tillåtna.');
				return;
			}

			if (file.size > 2 * 1024 * 1024) {
				setErrorMessage('Bilden får inte vara större än 2MB.');
				return;
			}

			setSelectedImage(file);
			setImagePreview(URL.createObjectURL(file));
			setErrorMessage('');
		}
	};

	const handleImageDelete = () => {
		setSelectedImage(null);
		setImagePreview(null);
		setErrorMessage('');

		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleSecondStep = () => {
		form.validate();
		if (form.isValid()) {
			setActiveStep('second');
		}
	};

	const handlePrevStep = (step: string) => {
		setActiveStep(step);
	};

	const handleThirdStep = () => {
		if (
			Object.keys(timeByDate).length === 0 ||
			Object.values(timeByDate)?.[0]?.start === '' ||
			Object.values(timeByDate)?.[0]?.end === '' ||
			Object.keys(timeError).length > 0
		) {
			setErrorMessage('Vänligen välj ett datum och ange en giltig tid för evenemanget.');
			return;
		}
		setErrorMessage('');
		setActiveStep('third');
	};

	const handleTimeChange = (
		year: string,
		date: string,
		timeType: 'start' | 'end',
		newTime: string,
	) => {
		setErrorMessage('');
		setTimeByDate((prev) => {
			const newTimeByDate = {
				...prev,
				[date]: {
					start: timeType === 'start' ? newTime : prev[date]?.start || '',
					end: timeType === 'end' ? newTime : prev[date]?.end || '',
					year,
				},
			};

			const startTime = newTimeByDate[date]?.start;
			const endTime = newTimeByDate[date]?.end;
			if (startTime && endTime && startTime > endTime) {
				setTimeError((prevErrors) => ({
					...prevErrors,
					[date]: 'Sluttiden kan inte vara tidigare än starttiden.',
				}));
			} else {
				setTimeError((prevErrors) => {
					const updatedErrors = { ...prevErrors };
					delete updatedErrors[date];
					return updatedErrors;
				});
			}

			return newTimeByDate;
		});
	};

	useEffect(() => {
		if (checked) {
			const firstDate = formatDateRangeArray[0]?.split('|')[0];
			const firstDateRange = firstDate && timeByDate[firstDate];

			if (firstDateRange) {
				const updatedTimeByDate: Record<string, TimeRange> = formatDateRangeArray.reduce(
					(acc, dateString) => {
						const [formattedDate, year] = dateString.split('|');

						if (!formattedDate || !year) return acc;

						acc[formattedDate] = {
							start: firstDateRange.start,
							end: firstDateRange.end,
							// @ts-ignore
							year,
						};
						return acc;
					},
					{} as Record<string, TimeRange>,
				);

				setTimeByDate((prevState) => {
					const isDifferent =
						JSON.stringify(prevState) !== JSON.stringify(updatedTimeByDate);
					return isDifferent ? updatedTimeByDate : prevState;
				});
			}
		}
	}, [checked, formatDateRangeArray, timeByDate]);

	useEffect(() => {
		if (activeStep === 'second' && !form.values?.input_42 && endingDate === null) {
			form.setFieldValue('input_40', 'aldrig');
			form.setFieldValue('input_41', 'aldrig');
		}
	}, [activeStep]);

	useEffect(() => {
		setIsHideEnding(form.values.input_40 === 'aldrig' || !form.values.input_40);
	}, [form.values.input_40]);

	useEffect(() => {
		setIsHideEndingSecond(form.values.input_41 === 'aldrig' || !form.values.input_40);
	}, [form.values.input_41]);

	if (data?.hide_this_block) {
		return null;
	}

	return (
		<Box
			className={`${classes.eventFormBlock} ${data?.is_first_block ? classes.firstBlock : ''}`}
		>
			<Container size="xl">
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
						<Accordion
							chevronPosition="right"
							value={activeStep}
							classNames={{
								root: classes.accordionWrap,
								label: classes.accordionLabel,
								control: classes.accordionControl,
								panel: classes.accordionPanel,
								chevron: classes.accordionChevron,
								item: classes.accordionItem,
								content: classes.accordionContent,
							}}
						>
							<Accordion.Item value="first">
								<Accordion.Control>{`1. ${data?.form_steps?.first_step?.label}`}</Accordion.Control>
								<Accordion.Panel>
									<Box className={classes.fields}>
										<Box className={classes.inputsWrap}>
											{finalFormsFields?.map((input, index: number) => (
												<InputForms
													key={index}
													data={input}
													customForm={form}
													classesProps={classes}
												/>
											))}
											<div className={classes.imageWrap}>
												<Text className={classes.imageLabel}>
													{
														data?.form_steps?.first_step
															?.upload_image_field?.label
													}
												</Text>
												<div className={classes.imageBtnWrap}>
													<Button
														className={`${classes.imageBtn}`}
														component="label"
														leftSection={<IconMedia />}
													>
														{
															data?.form_steps?.first_step
																?.upload_image_field?.button_title
														}
														<input
															type="file"
															accept="image/jpeg, image/png, image/webp"
															ref={fileInputRef}
															hidden
															onChange={handleImageChange}
														/>
													</Button>
													{imagePreview && (
														<Box className={classes.imagePreview}>
															<Image
																loading={'lazy'}
																src={imagePreview}
																alt="Image Preview"
																width={60}
																height={60}
																radius={8}
															/>
															<IconRemove
																className={classes.deleteBtn}
																onClick={handleImageDelete}
															/>
														</Box>
													)}
												</div>
												<Text className={classes.imageDescription}>
													{
														data?.form_steps?.first_step
															?.upload_image_field?.description
													}
												</Text>
											</div>
										</Box>
										{errorMessage && (
											<Box
												className={classes.errorMessage}
												dangerouslySetInnerHTML={{ __html: errorMessage }}
											/>
										)}
										<Group className={classes.buttonWrap}>
											<Button
												className={`${classes.cancelBtn}`}
												onClick={() =>
													router.push(
														`/${lang}/gottsundakalendern/instrumentpanelen/`,
													)
												}
											>
												{
													data?.form_steps?.first_step?.buttons
														?.cancel_label
												}
											</Button>
											<Button
												className={`${classes.nextBtn}`}
												onClick={handleSecondStep}
											>
												{data?.form_steps?.first_step?.buttons?.next_label}
											</Button>
										</Group>
									</Box>
								</Accordion.Panel>
							</Accordion.Item>

							<Accordion.Item value="second">
								<Accordion.Control>{`2. ${data?.form_steps?.second_step?.label}`}</Accordion.Control>
								<Accordion.Panel>
									<Group className={classes.calendarBox}>
										<Box className={classes.calendar}>
											<Text className={classes.calendarLabel}>
												{data?.form_steps?.second_step?.calendar?.label}
											</Text>
											<Box className={classes.calendarWrap}>
												<DatePicker
													classNames={{
														calendarHeaderLevel:
															classes.calendarHeaderLevel,
														levelsGroup: classes.calendarGroupLevel,
														calendarHeaderControlIcon:
															classes.calendarHeaderControlIcon,
														weekday: classes.weekday,
														day: classes.day,
													}}
													minDate={new Date()}
													type="range"
													allowSingleDateInRange
													value={selectedDate}
													onChange={(date) => {
														setTimeByDate({});
														setTimeError({});
														setErrorMessage('');
														setIsHideEnding(true);
														setIsHideEndingSecond(true);
														setSelectedDate(date);
														form.setFieldValue('input_40', 'aldrig');
														form.setFieldValue('input_41', 'aldrig');
														setEndingDate(null);
													}}
												/>
											</Box>
										</Box>
										{selectedDate[1] !== null && (
											<Box className={classes.calendar}>
												<Text className={classes.calendarLabel}>
													{
														data?.form_steps?.second_step?.time_block
															?.label
													}
												</Text>
												<Box className={classes.timeWrap}>
													{formatDateRangeArray?.map(
														(formatStr: string, idx) => {
															const date = formatStr.split('|')[0];
															const year = formatStr.split('|')[1];

															const lastDate =
																formatDateRangeArray[
																	formatDateRangeArray.length - 1
																]?.split('|')[0];

															if (!date || !year) return null;

															const isDisabled =
																checked && idx !== 0
																	? `${classes.disabled}`
																	: '';
															return (
																<Box
																	key={idx}
																	className={`${classes.calendarWrap} ${isDisabled}`}
																>
																	<Text
																		className={classes.timeDate}
																	>
																		{checked &&
																		!areDatesEqual(
																			selectedDate[0],
																			selectedDate[1],
																		)
																			? `${date} - ${lastDate}`
																			: date}
																	</Text>
																	<Group gap={8}>
																		<Group
																			gap={8}
																			className={
																				classes.timeInputWrap
																			}
																		>
																			<Text
																				className={
																					classes.calendarLabel
																				}
																			>
																				{
																					data?.form_steps
																						?.second_step
																						?.time_block
																						?.start_time
																				}
																			</Text>
																			<TimeInput
																				value={
																					timeByDate[date]
																						?.start ||
																					''
																				}
																				onChange={(event) =>
																					handleTimeChange(
																						year,
																						date,
																						'start',
																						event
																							.currentTarget
																							.value,
																					)
																				}
																				classNames={{
																					root: classes.inputTimeWrap,
																					input: classes.inputTime,
																				}}
																			/>
																		</Group>
																		<Group
																			gap={8}
																			className={
																				classes.timeInputWrap
																			}
																		>
																			<Text
																				className={
																					classes.calendarLabel
																				}
																			>
																				{
																					data?.form_steps
																						?.second_step
																						?.time_block
																						?.end_time
																				}
																			</Text>
																			<TimeInput
																				value={
																					timeByDate[date]
																						?.end || ''
																				}
																				onChange={(event) =>
																					handleTimeChange(
																						year,
																						date,
																						'end',
																						event
																							.currentTarget
																							.value,
																					)
																				}
																				classNames={{
																					root: classes.inputTimeWrap,
																					input: classes.inputTime,
																				}}
																			/>
																		</Group>
																	</Group>
																	{timeError[date] && (
																		<Text
																			className={
																				classes.smallErrorMessage
																			}
																		>
																			{timeError[date]}
																		</Text>
																	)}
																</Box>
															);
														},
													)}
												</Box>
												<Group className={classes.switchWrap}>
													<Text className={classes.switchLabel}>
														{
															data?.form_steps?.second_step
																?.time_block?.checkbox_label
														}
													</Text>
													<Switch
														checked={checked}
														onChange={(event) => {
															setTimeError((prev) => {
																const keys = Object.keys(prev);

																if (keys.length === 0) {
																	return prev;
																}

																const firstKey = keys[0];
																return {
																	// @ts-ignore
																	[firstKey]: prev[firstKey],
																};
															});
															setChecked(event.currentTarget.checked);
														}}
														size="md"
														color="#19204D"
													/>
												</Group>
												<Box
													className={`${classes.inputsWrap} ${classes.calendarInputsWrap}`}
												>
													{secondFinalFormsFields?.map(
														(input, index: number) => {
															if (
																form.values?.input_41 === 'datum' &&
																index === 2
															)
																return;

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
													{form.values?.input_41 === 'datum' && (
														<DateInput
															classNames={{
																calendarHeaderLevel:
																	classes.calendarHeaderLevel,
																calendarHeaderControlIcon:
																	classes.calendarHeaderControlIcon,
																weekday: classes.weekday,
																day: classes.day,
																label: classes.dateInputLabel,
																input: classes.dateInput,
																root: classes.dateInputWrap,
															}}
															minDate={new Date()}
															label={
																data?.form_steps?.second_step
																	?.time_block?.ending_date?.label
															}
															value={endingDate}
															onChange={setEndingDate}
															valueFormat="MMM DD, YYYY"
														/>
													)}
												</Box>
											</Box>
										)}
									</Group>
									{errorMessage && (
										<Box
											className={classes.errorMessage}
											dangerouslySetInnerHTML={{ __html: errorMessage }}
										/>
									)}
									<Group className={classes.buttonWrap}>
										<Button
											className={`${classes.cancelBtn}`}
											onClick={() => handlePrevStep('first')}
										>
											{data?.form_steps?.second_step?.buttons?.cancel_label}
										</Button>
										<Button
											className={`${classes.nextBtn}`}
											onClick={handleThirdStep}
										>
											{data?.form_steps?.second_step?.buttons?.next_label}
										</Button>
									</Group>
								</Accordion.Panel>
							</Accordion.Item>

							<Accordion.Item value="third">
								<Accordion.Control>{`3. ${data?.form_steps?.third_step?.label}`}</Accordion.Control>
								<Accordion.Panel>
									<Text
										className={classes.calendarLabel}
										dangerouslySetInnerHTML={{
											__html: data?.form_steps?.third_step?.description,
										}}
									/>
									<Box className={classes.infoWrap}>
										<Text className={classes.listLabel}>
											{data?.form_steps?.third_step?.block_info?.first_label}
										</Text>
										<ul className={classes.info}>
											{firstFields?.formFields?.nodes?.map((item, index) => {
												const formValue =
													form.values?.[`input_${item?.id}`];

												const value =
													item?.id === 33 && Array.isArray(formValue)
														? eventsCategories
																?.filter((category) =>
																	formValue?.includes(
																		String(category?.id),
																	),
																)
																.map((category) => category.name)
																.join(', ')
														: formValue;

												return (
													<li key={`${index}-${index + 1}`}>
														<Group className={classes.infoList}>
															<Text className={classes.calendarLabel}>
																{item?.label}:
															</Text>
															<Text className={classes.calendarLabel}>
																{value &&
																	(Array.isArray(
																		value?.split('\n'),
																	)
																		? value?.split('\n')
																		: []
																	)?.map((line, lineIndex) => (
																		<React.Fragment
																			key={lineIndex}
																		>
																			{line}
																			<br />
																		</React.Fragment>
																	))}
															</Text>
														</Group>
													</li>
												);
											})}
										</ul>
										<Text className={classes.listLabel}>
											{data?.form_steps?.third_step?.block_info?.second_label}
										</Text>
										<ul className={classes.info}>
											{(Array.isArray(Object.entries(timeByDate))
												? Object.entries(timeByDate)
												: []
											)?.map((value, idx) => {
												return (
													<li key={`${idx}-${idx + 1}`}>
														<Text className={classes.calendarLabel}>
															{`${value[0]}: ${value[1]?.start} - ${value[1]?.end}`}
														</Text>
													</li>
												);
											})}
											{(Array.isArray(secondFields?.formFields?.nodes)
												? secondFields?.formFields?.nodes
												: []
											)?.map((item, index) => {
												if (
													form.values?.input_41 === 'datum' &&
													index === 2
												)
													return null;

												return (
													<li key={`${index}-${index + 1}`}>
														<Text className={classes.calendarLabel}>
															{`${item?.label}: ${form.values?.[`input_${item?.id}`]}`}
														</Text>
													</li>
												);
											})}
											{endingDate !== null &&
												form.values?.input_41 === 'datum' && (
													<li>
														<Text className={classes.calendarLabel}>
															{`${data?.form_steps?.second_step?.time_block?.ending_date?.label}: ${formatDate(endingDate, 'MMM dd, yyyy')}`}
														</Text>
													</li>
												)}
										</ul>
										<Button
											className={`${classes.nextBtn}`}
											onClick={() => handlePrevStep('first')}
										>
											{data?.form_steps?.third_step?.block_info?.button_title}
										</Button>
									</Box>
									<Group className={classes.buttonWrap}>
										<Button
											className={`${classes.cancelBtn}`}
											onClick={() => handlePrevStep('second')}
										>
											{data?.form_steps?.third_step?.buttons?.cancel_label}
										</Button>

										<Button
											className={`${classes.nextBtn} ${isFormLoading ? classes.loading : ''}`}
											type={'submit'}
										>
											{data?.form_steps?.third_step?.buttons?.next_label}
											{isFormLoading && (
												<IconLoading
													className={classes.loadingIcon}
													color={'#000000'}
												/>
											)}
										</Button>
									</Group>
								</Accordion.Panel>
							</Accordion.Item>
						</Accordion>

						{confirmationMessage && (
							<Box
								className={classes.confirmationMessage}
								dangerouslySetInnerHTML={{ __html: confirmationMessage }}
							/>
						)}
					</form>
				</Box>
			</Container>
		</Box>
	);
};

export default EventFormBlock;
