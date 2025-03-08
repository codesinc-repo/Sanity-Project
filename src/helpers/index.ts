import { useForm } from '@mantine/form';
import {
	addDays,
	addMonths,
	addWeeks,
	addYears,
	differenceInMilliseconds,
	differenceInSeconds,
	endOfDay,
	format,
	isWithinInterval,
	parse,
	parseISO,
	startOfDay,
} from 'date-fns';
import { enUS, sv } from 'date-fns/locale';

import type { Locale } from '../../i18n-config';
import type {
	FieldType,
	FormFieldsType,
	GroupedEvent,
	IEventData,
	IEventFormSteps,
	IEvents,
	IFormFields,
	IGravityForms,
	IInputIcon,
	InitialValuesType,
	IOpeningHoursItem,
	ProcessedEvent,
	RecurringEventType,
	StoreHours,
} from './global.interface';

/**
 * Determines the contact type (phone number or email address) and adds corresponding prefixes.
 * @param input The string with contact information.
 * @returns A string with the added prefix "tel:" or "mailto:" if it's a phone number or email address respectively.
 *          If the input string doesn't match either a phone number or email address, it returns the original string
 *   unchanged.
 */
export const determineContactType = (input: string): string => {
	const phoneRegex = /^[+\d() -]+$/;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (phoneRegex.test(input)) {
		return `tel:${input.replace(/[^+0-9]/g, '')}`;
	}
	if (emailRegex.test(input)) {
		return `mailto:${input}`;
	}

	return `https://www.google.com/maps/search/?api=1&query=${input}`;
};

/**
 * Converts a given date string to the format "dd MMMM yyyy".
 * @param dateString The date string to be converted.
 * @returns The converted date string in the format "dd MMMM yyyy".
 */
export const convertDate = (dateString: string): string => {
	const date = new Date(dateString);
	return format(date, 'yyyy-MM-dd');
};

/**
 * Modifies links in the given string based on the value of the NEXT_PUBLIC_SITE_URL environment variable.
 * If NEXT_PUBLIC_SITE_URL is a valid string, the function replaces all occurrences of that string in the input string
 * with an empty string. Then, it removes a trailing slash (/) from the string, if present.
 *
 * @param string - The input string in which links need to be modified.
 * @param lang
 * @returns The modified string with links replaced and trailing slash removed (if applicable).
 *
 * Notes:
 * - If NEXT_PUBLIC_SITE_URL is not a valid string or is undefined, the function returns the input string unchanged.
 * - Link modification is performed by using the replace() method to replace all occurrences of the specified string.
 * - The trailing slash removal is achieved using a regular expression (/\/$/) to match and remove the slash at the end
 *   of the string.
 */
export const modifyLinks = (string: string, lang: string): string => {
	const replace: string | undefined = process.env.NEXT_PUBLIC_SITE_URL;

	if (typeof replace === 'string') {
		string.replace(replace, '').replace(/\/$/, '');
		return `/${lang}${string}`;
	}

	return `${lang}/${string}`;
};

/**
 * Returns a validation function based on the field type.
 * @param type - The type of the field (TEXT, PHONE, EMAIL, POST_EXCERPT).
 * @param label
 * @param isPassword
 * @returns A validation function based on the field type.
 */
export const getValidationRule = (
	type: FieldType,
	label: string | undefined,
	isPassword: boolean | undefined,
): ((value: string) => string | undefined) => {
	switch (type) {
		case 'TEXT':
			return (value: string) => {
				if (!value.trim()) {
					return `Får inte vara tomt`;
				}

				if (isPassword) {
					return value.length >= 8
						? undefined
						: 'Lösenordet måste vara minst 8 tecken långt';
				}

				if (label === 'Aktivitetsnamn' || label === 'Aktivitetsansvarig kontaktperson') {
					return /^[A-Za-zåäöÅÄÖ\- ,]+$/.test(value)
						? undefined
						: `Får endast innehålla bokstäver och kommatecken`;
				}

				if (label === 'Arrangör/Plats' || label === 'Adress') {
					return value.trim() !== '' ? undefined : `${label} får inte vara tomt`;
				}

				return /^[A-Za-zåäöÅÄÖ\- ]{2,30}$/.test(value)
					? undefined
					: `${label} måste vara 2-30 tecken långt och får endast innehålla bokstäver`;
			};
		case 'MULTI_SELECT':
			return (value: string) => {
				if (Array.isArray(value)) {
					return value.length <= 3 ? undefined : `Du kan välja högst 3 ${label}`;
				}
				return `${label} är obligatoriskt`;
			};
		case 'PHONE':
			return (value: string) =>
				/[+\s0-9]{5,15}/.test(value)
					? undefined
					: 'Telefonnumret är felaktigt eller i fel format.';
		case 'EMAIL':
			return (value: string) =>
				/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
					? undefined
					: 'Du har angivit fel e-postadress';
		case 'POST_EXCERPT':
			return (value: string) =>
				value?.trim() !== '' ? undefined : 'Meddelandefält är obligatoriskt';
		default:
			return () => undefined;
	}
};

export const getValidationRuleEvent = (
	input: IFormFields,
	formStepsData: IEventFormSteps | undefined,
) => {
	switch (input?.name) {
		case 'input_31':
			return (value: string) => {
				if (!value.trim()) {
					return `Får inte vara tomt`;
				}

				return /^[A-Za-zåäöÅÄÖ\- ,]+$/.test(value)
					? undefined
					: formStepsData?.first_step?.activity_name_field?.error_text;
			};
		case 'input_32':
			return (value: string) =>
				value.trim() ? undefined : formStepsData?.first_step?.description_field?.error_text;
		case 'input_33':
			return (value: string) => {
				return value.length !== 0 && value.length <= 3
					? undefined
					: formStepsData?.first_step?.select_category_field?.error_text;
			};
		case 'input_34':
			return (value: string) =>
				value.trim()
					? undefined
					: formStepsData?.first_step?.organiserplace_field?.error_text;
		case 'input_35':
			return (value: string) =>
				value.trim()
					? undefined
					: formStepsData?.first_step?.contact_person_field?.error_text;
		case 'input_36':
			return (value: string) => {
				if (!value.trim()) {
					return `Får inte vara tomt`;
				}
				return /[+\s0-9]{5,15}/.test(value)
					? undefined
					: formStepsData?.first_step?.phone_number_field?.error_text;
			};
		case 'input_37':
			return (value: string) => {
				if (!value.trim()) {
					return `Får inte vara tomt`;
				}
				return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
					? undefined
					: formStepsData?.first_step?.email_address_field?.error_text;
			};
		case 'input_38':
			return (value: string) =>
				value.trim() ? undefined : formStepsData?.first_step?.address_field?.error_text;

		default:
			return () => undefined;
	}
};

/**
 * Checks if the given pathname is an active link based on the provided link path.
 * @param pathname The current pathname to compare.
 * @param link The link path to check against the pathname.
 * @param lang
 * @returns Boolean indicating whether the link is active or not.
 */
export const isActiveLink = (pathname: string, link: string, lang: string): boolean => {
	const siteUrl: string | undefined = process.env.NEXT_PUBLIC_SITE_URL;

	try {
		if (siteUrl) {
			const currentUri = new URL(link, siteUrl).href;
			let pathnameUri = new URL(pathname, siteUrl).href;

			pathnameUri = pathnameUri.replace(`/${lang}`, '');

			return currentUri === pathnameUri;
		}
	} catch (error) {
		console.error('Error comparing URLs:', error);
	}

	return false;
};

/**
 * Generate form fields based on the provided Gravity Forms structure and an array of input icons.
 *
 * @param {IGravityForms} currentFormFields - The Gravity Forms structure containing form fields.
 * @param classes
 * @param {IInputIcon[]} input_icon - An array of input icons associated with form fields (default is an empty array).
 * @param showLabel
 * @returns {IFormFields[]} - An array of form field objects, each containing type, className, placeholder, label,
 *   size, name, and icon.
 */
export const generateFormsFields = (
	currentFormFields: IGravityForms,
	classes: any,
	input_icon: IInputIcon[] = [],
	showLabel: boolean = false,
): IFormFields[] => {
	return currentFormFields?.formFields?.nodes?.map((input) => {
		const iconObject = input_icon?.find((iconItem) => {
			return (
				(iconItem.inputId && +iconItem.inputId) === input.id ||
				(iconItem.input_id && +iconItem.input_id) === input.id
			);
		});

		return {
			type: input?.type,
			className: `${classes?.fieldInput} ${input?.className}`,
			placeholder: input?.placeholder,
			label: showLabel ? input?.label : '',
			size: input?.size,
			name: `input_${input?.id}`,
			icon: iconObject?.icon?.svg || '',
			isRequired: input?.isRequired,
			choices: input?.choices,
			defaultValue: input?.defaultValue,
			isPasswordInput: input?.isPasswordInput,
		};
	});
};

/**
 * Generate form configuration based on the provided form fields.
 *
 * @param finalFormsFields - An array of form fields generated by generateFormsFields function.
 * @param formStepsData
 * @param isEventForm
 * @returns - An object containing form fields configuration, initial values, and form validation.
 */
export const generateForm = (
	finalFormsFields: IFormFields[],
	formStepsData?: IEventFormSteps,
	isEventForm: boolean = false,
) => {
	const formFields: FormFieldsType = (finalFormsFields || []).reduce((acc, input) => {
		if (input.isRequired) {
			acc[input.name] = isEventForm
				? getValidationRuleEvent(input, formStepsData)
				: getValidationRule(input.type, input?.label, input?.isPasswordInput);
		}
		return acc;
	}, {} as FormFieldsType);

	const initialValues: InitialValuesType = (finalFormsFields || []).reduce((acc, input) => {
		acc[input.name] = '';
		return acc;
	}, {} as InitialValuesType);

	return useForm({
		initialValues,
		validate: (values) => {
			const errors: Record<string, string> = {};

			Object.keys(values).forEach((key) => {
				if (Object.prototype.hasOwnProperty.call(values, key) && formFields) {
					const validationFunction = formFields[key];
					if (validationFunction) {
						const errorMessage = validationFunction(values[key]);
						if (errorMessage) {
							errors[key] = errorMessage;
						}
					}
				}
			});

			return errors;
		},
	});
};

export const getClosingTime = (storeCloseTime: string | undefined): Date => {
	if (!storeCloseTime) return new Date();
	const closeTimeParts = storeCloseTime.split(':').map((part) => parseInt(part, 10));
	const closingTime = new Date();
	closingTime.setHours(closeTimeParts[0] || 0);
	closingTime.setMinutes(closeTimeParts[1] || 0);
	closingTime.setSeconds(closeTimeParts[2] || 0);
	return closingTime;
};

// Function to get the appropriate locale for date-fns
const getDateFnsLocale = (locale: Locale) => {
	switch (locale) {
		case 'sv':
			return sv; // Swedish locale
		case 'en':
		default:
			return enUS; // Default to English locale
	}
};

/**
 * Formats the event dates according to specific rules:
 * - If there is only one event date, returns it in the format "17 October".
 * - If there are multiple dates in the same month, returns them in the format "18 – 19 October".
 * - If the dates span different months, returns them in the format "17 October – 25 November".
 * - Optionally includes the year in the format, e.g., "17 October 2024".
 *
 *   have at least one element.
 * @param event
 * @param locale - A string representing the locale ('en' for English, 'sv' for Swedish). This locale is used to format
 *   the month names and date strings.
 * @param fullMonth - Boolean indicating whether to use the full month name (e.g., "October") or short form (e.g., "Oct").
 * @param withYear - Boolean indicating whether to include the year in the formatted date.
 *
 * @returns A string representing the formatted date(s) according to the rules above.
 */
export const formatEventDateTime = (
	event: IEventData,
	locale: Locale,
	fullMonth = true,
	withYear = false,
): string => {
	const chose_event_date = event?.events;

	if (!chose_event_date || chose_event_date.length === 0) return '';

	const monthFormat = fullMonth ? 'MMMM' : 'MMM';
	const yearFormat = withYear ? ' yyyy' : ''; // Add year if `withYear` is true
	const dateFnsLocale = getDateFnsLocale(locale); // Get the locale for date-fns

	const parseDate = (dateStr: string) => parse(dateStr, 'dd/MM/yyyy', new Date()); // Parse the date

	// Check if the first element exists and has a date
	const startEvent = chose_event_date[0];
	if (!startEvent || !startEvent.date) return '';

	const startDate = parseDate(startEvent.date); // Parse the start date

	if (event.recurring_event !== 'aldrig' && event.ending === 'aldrig') {
		const currentDate = new Date();
		currentDate.setHours(0, 0, 0, 0);

		const recurringDate = new Date(startDate);
		recurringDate.setHours(0, 0, 0, 0);

		if (recurringDate.getTime() === currentDate.getTime()) {
			return `${format(recurringDate, `d ${monthFormat}${yearFormat}`, { locale: dateFnsLocale })}`;
		}

		while (recurringDate < currentDate) {
			switch (event.recurring_event) {
				case 'varjeDag':
					recurringDate.setDate(recurringDate.getDate() + 1);
					break;
				case 'varjeVecka':
					recurringDate.setDate(recurringDate.getDate() + 7);
					break;
				case 'varjeManad':
					recurringDate.setMonth(recurringDate.getMonth() + 1);
					break;
				case 'varjeAr':
					recurringDate.setFullYear(recurringDate.getFullYear() + 1);
					break;
			}
		}

		return `${format(recurringDate, `d ${monthFormat}${yearFormat}`, { locale: dateFnsLocale })}`;
	}

	// If there is only one event, return that date
	if (chose_event_date.length === 1) {
		return format(startDate, `d ${monthFormat}${yearFormat}`, { locale: dateFnsLocale });
	}

	// Get the last event in the array
	const endEvent = chose_event_date[chose_event_date.length - 1];
	const endDate = endEvent && endEvent.date ? parseDate(endEvent.date) : null; // Parse the end date, if it exists

	const formatDayMonthYear = (date: Date) =>
		format(date, `d ${monthFormat}${yearFormat}`, { locale: dateFnsLocale });
	const formatDay = (date: Date) => format(date, 'd', { locale: dateFnsLocale });
	const formatMonthYear = (date: Date) =>
		format(date, `${monthFormat}${yearFormat}`, { locale: dateFnsLocale });

	// If the start and end date are in the same month
	if (endDate && startDate.getMonth() === endDate.getMonth()) {
		return `${formatDay(startDate)} – ${formatDay(endDate)} ${formatMonthYear(startDate)}`;
	}

	// If the start and end date are in different months
	if (endDate) {
		return `${formatDayMonthYear(startDate)} – ${formatDayMonthYear(endDate)}`;
	}

	// In case the end date is null (unlikely)
	return formatDayMonthYear(startDate);
};

export const formatEventStartDateTime = (chose_event_date: IEvents[], locale: Locale): string => {
	if (!chose_event_date || chose_event_date.length === 0) return '';

	const dateFnsLocale = getDateFnsLocale(locale); // Get the locale for date-fns

	const parseDate = (dateStr: string) => parse(dateStr, 'dd/MM/yyyy', new Date()); // Parse the date

	// Check if the first element exists and has a date
	const startEvent = chose_event_date[0];
	if (!startEvent || !startEvent.date) return '';

	const startDate = parseDate(startEvent.date); // Parse the start date

	// Return the start date formatted as 'd MMM' (e.g., '10 Jan')
	return format(startDate, 'd MMM', { locale: dateFnsLocale });
};

/**
 * Checks if any event in the list has different time_from or time_to compared to the first event.
 * @param events - An array of event objects.
 * @returns A boolean indicating if there is a time difference (true) or not (false).
 */
export const hasDifferentEventTimes = (events: IEvents[]): boolean => {
	if (!events || events.length === 0) return false;

	const firstEvent = events[0];

	return events.some(
		(event) =>
			event.time_from !== firstEvent?.time_from || event.time_to !== firstEvent?.time_to,
	);
};

/**
 * Checks if the store is open and calculates the remaining time until the store closes if it is open,
 * or until it opens if it is closed.
 *
 * @param {Date} currentDateTime - The current date and time.
 * @param {StoreHours} storeHours - The store's operating hours including weekdays, weekends, and holidays.
 * @returns {string | null} - Returns a message indicating the time left until closing if the store is open,
 * or the time until it opens if it is closed.
 */
export const checkStoreStatusAndGetTimeToClosing = (
	currentDateTime: Date,
	storeHours: StoreHours,
): string | null => {
	const dayOfWeek = currentDateTime.getDay();
	const currentTime = format(currentDateTime, 'HH:mm:ss');
	const isHoliday = storeHours.holidays.some((holidayPeriod) => {
		const holidayStart = parseISO(holidayPeriod.startHolidays);
		const holidayEnd = holidayPeriod.endHolidays
			? parseISO(holidayPeriod.endHolidays)
			: startOfDay(holidayStart);
		return isWithinInterval(currentDateTime, {
			start: holidayStart,
			end: endOfDay(holidayEnd),
		});
	});

	let openingTime: string | undefined;
	let closingTime: string | undefined;

	if (isHoliday) {
		const activeHoliday = storeHours.holidays.find((holidayPeriod) => {
			const holidayStart = parseISO(holidayPeriod.startHolidays);
			const holidayEnd = holidayPeriod.endHolidays
				? parseISO(holidayPeriod.endHolidays)
				: startOfDay(holidayStart);
			return isWithinInterval(currentDateTime, {
				start: holidayStart,
				end: endOfDay(holidayEnd),
			});
		});
		if (activeHoliday) {
			openingTime = activeHoliday.opening;
			closingTime = activeHoliday.closing;
		}
	} else {
		switch (dayOfWeek) {
			case 0: // Sunday
				openingTime = storeHours.sunday.opening;
				closingTime = storeHours.sunday.closing;
				break;
			case 6: // Saturday
				openingTime = storeHours.saturday.opening;
				closingTime = storeHours.saturday.closing;
				break;
			default: // Weekdays (Monday to Friday)
				openingTime = storeHours.weekDays.opening;
				closingTime = storeHours.weekDays.closing;
				break;
		}
	}

	if (openingTime && closingTime) {
		const [openingHours, openingMinutes, openingSeconds] = openingTime.split(':').map(Number);
		const [closingHours, closingMinutes, closingSeconds] = closingTime.split(':').map(Number);

		if (
			openingHours !== undefined &&
			openingMinutes !== undefined &&
			openingSeconds !== undefined &&
			closingHours !== undefined &&
			closingMinutes !== undefined &&
			closingSeconds !== undefined
		) {
			const openingDateTime = new Date(currentDateTime);
			openingDateTime.setHours(openingHours, openingMinutes, openingSeconds, 0);

			const closingDateTime = new Date(currentDateTime);
			closingDateTime.setHours(closingHours, closingMinutes, closingSeconds, 0);

			if (currentTime >= openingTime && currentTime <= closingTime) {
				// Store is open
				const secondsToClose = differenceInSeconds(closingDateTime, currentDateTime);
				if (secondsToClose > 0) {
					const hoursToClose = Math.floor(secondsToClose / 3600);
					const remainingSeconds = secondsToClose % 3600;
					const minutesToClose = Math.floor(remainingSeconds / 60);
					const secondsLeft = remainingSeconds % 60;
					return `Stänger om ${hoursToClose}:${minutesToClose < 10 ? '0' : ''}${minutesToClose}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
				}
			} else {
				// Store is closed
				if (currentTime < openingTime) {
					// Opens later today
					const secondsToOpen = differenceInSeconds(openingDateTime, currentDateTime);
					const hoursToOpen = Math.floor(secondsToOpen / 3600);
					const remainingSeconds = secondsToOpen % 3600;
					const minutesToOpen = Math.floor(remainingSeconds / 60);
					const secondsLeft = remainingSeconds % 60;
					return `Öppnar om ${hoursToOpen}:${minutesToOpen < 10 ? '0' : ''}${minutesToOpen}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
				}
				// Opens next day
				const nextOpeningDateTime = addDays(openingDateTime, 1);
				const millisecondsToNextOpen = differenceInMilliseconds(
					nextOpeningDateTime,
					currentDateTime,
				);
				const secondsToNextOpen = Math.floor(millisecondsToNextOpen / 1000);
				const hoursToNextOpen = Math.floor(secondsToNextOpen / 3600);
				const remainingSeconds = secondsToNextOpen % 3600;
				const minutesToNextOpen = Math.floor(remainingSeconds / 60);
				const secondsLeft = remainingSeconds % 60;
				return `Öppnar om ${hoursToNextOpen}:${minutesToNextOpen < 10 ? '0' : ''}${minutesToNextOpen}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
			}
		}
	}

	return null;
};

export const getTimeUntilEvent = (
	items: IOpeningHoursItem[],
	timeOptions: boolean,
): string | null => {
	const today = new Date();
	const currentDay = today.getDay();
	const currentTime = today.getHours() * 60 + today.getMinutes(); // Convert current time to minutes

	let item: IOpeningHoursItem | undefined;

	if (items.length === 3) {
		// If there are three items, use them for Monday-Friday, Saturday, and Sunday
		item =
			currentDay >= 1 && currentDay <= 5
				? items[0] // Monday to Friday
				: currentDay === 6
					? items[1] // Saturday
					: items[2]; // Sunday
	} else if (items.length === 2) {
		// If there are two items, use them for weekdays and weekends
		item =
			currentDay >= 1 && currentDay <= 5
				? items[0] // Weekdays
				: items[1]; // Weekends
	} else if (items.length === 1) {
		// If there is one item, use it for all days
		item = items[0];
	} else {
		return null;
	}

	if (!item) {
		return null;
	}

	const [openingTime, closingTime] = item.time.split(' – ').map((t) => {
		const [hours, minutes] = t.split(':').map(Number);
		return (hours || 0) * 60 + (minutes || 0); // Convert time to minutes
	});

	if (openingTime === undefined || closingTime === undefined) {
		return null;
	}

	const targetTime = timeOptions ? closingTime : openingTime; // Calculate time until closing or opening

	// Calculate the difference in minutes
	let timeDifference = targetTime - currentTime;

	// Return null if the time difference is 0 or less
	if (timeDifference <= 0) {
		return '';
	}

	// If the time difference is negative, it means the target time is for the next day
	if (timeDifference < 0) {
		timeDifference += 24 * 60; // Adjust the difference to the next day
	}

	// Convert the difference to hours and minutes
	const hours = Math.floor(timeDifference / 60);
	const minutes = timeDifference % 60;

	return hours > 0 ? `${hours} hours left` : `${minutes} minutes left`;
};

/**
 * Takes an array with two Date objects and returns an array of strings representing
 * all dates between them (inclusive) in the format "12 januari".
 *
 * @param selectedDate - Array with two Date objects [startDate, endDate].
 * @returns An array of formatted date strings.
 */
export const formatDateRange = (selectedDate: [Date | null, Date | null]): string[] => {
	const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
	const result: string[] = [];

	if (!selectedDate[0] || !selectedDate[1]) return result;

	const startDate = new Date(selectedDate[0]);
	const endDate = new Date(selectedDate[1]);

	// Add each date from start to end to the result array
	while (startDate <= endDate) {
		// Get the formatted date string
		const formattedDate = startDate.toLocaleDateString('sv-SE', options);
		// Get the year
		const year = startDate.getFullYear();
		// Combine date and year into the result string
		result.push(`${formattedDate}|${year}`);
		// Increment date by 1 day
		startDate.setDate(startDate.getDate() + 1);
	}

	return result;
};

export const formatSingleDate = (selectedDate: Date | null): string => {
	const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };

	if (!selectedDate) return '';

	const date = new Date(selectedDate);

	const formattedDate = date.toLocaleDateString('sv-SE', options);
	// Get the year
	const year = date.getFullYear();
	// Combine date and year into the result string
	return `${formattedDate}|${year}`;
};

export const processEvents = (eventsResponse: IEventData[]): ProcessedEvent[] => {
	const events = eventsResponse.map((event) => {
		if (!event?.events?.[0])
			return {
				...event,
				dateTimeFrom: new Date(),
				dateTimeTo: new Date(),
			};

		const eventDate = new Date(
			event.events[0].date.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'),
		);
		const eventTimeFrom = new Date(`1970-01-01T${event.events[0].time_from}Z`);
		const eventTimeTo = new Date(`1970-01-01T${event.events[0].time_to}Z`);

		return {
			...event,
			dateTimeFrom: new Date(
				eventDate.getFullYear(),
				eventDate.getMonth(),
				eventDate.getDate(),
				eventTimeFrom.getHours(),
				eventTimeFrom.getMinutes(),
				eventTimeFrom.getSeconds(),
			),
			dateTimeTo: new Date(
				eventDate.getFullYear(),
				eventDate.getMonth(),
				eventDate.getDate(),
				eventTimeTo.getHours(),
				eventTimeTo.getMinutes(),
				eventTimeTo.getSeconds(),
			),
		};
	});

	const filteredEvents = events.filter((event) => event.dateTimeTo > new Date());

	filteredEvents.sort((a, b) => a.dateTimeFrom.getTime() - b.dateTimeFrom.getTime());

	return filteredEvents;
};

/**
 * Formats a full date range for a group of events.
 * If there is only one event, it returns the formatted date of that event.
 * If dates are in the same month, the format is "14 – 16 mars".
 * If dates are in different months, the format is "14 mars – 16 avril".
 *
 * @param events - Array of events to extract the date range from
 * @returns Formatted date range string
 */
export const formatFullDateRange = (events: IEvents[] = []): string => {
	// Helper function to format a date string from d/m/Y format to a more readable format
	const formatDate = (dateStr: string, formatMonth: boolean = true): string => {
		const [day, month, year] = dateStr.split('/');
		if (!day || !month || !year) {
			return ''; // Return empty string if date is invalid
		}
		const date = new Date(`${year}-${month}-${day}`);
		// Conditionally return only the day if formatMonth is false
		return date.toLocaleDateString('sv-SE', {
			day: 'numeric',
			...(formatMonth ? { month: 'long' } : {}),
		});
	};

	// If only one event is in the group, return a single date
	if (events.length === 1) {
		return formatDate(events[0]?.date || '');
	}

	// Extract the first and last event dates
	const startDate = events[0]?.date || '';
	const endDate = events[events.length - 1]?.date || '';

	// Extract month and year for comparison
	const [startMonth, startYear] = startDate.split('/').slice(1);
	const [endMonth, endYear] = endDate.split('/').slice(1);

	// If dates are in the same month and year, format as "14 – 16 mars"
	if (startMonth === endMonth && startYear === endYear) {
		return `${formatDate(startDate, false)} – ${formatDate(endDate)}`;
	}

	// If dates are in different months or years, format as "14 mars – 16 avril"
	return `${formatDate(startDate)} – ${formatDate(endDate)}`;
};

/**
 * Formats the time range for a single event.
 * Converts time strings by replacing ":" with "." for a more readable format.
 *
 * @param event - Event object to extract the time range from
 * @returns Formatted time range string
 */
export const formatFullTimeRange = (event: IEvents | undefined): string => {
	// Ensure time_from and time_to are defined to avoid formatting errors
	if (!event?.time_from || !event?.time_to) {
		return ''; // Return empty string if time range is missing
	}

	// Helper function to format time string by replacing ":" with "."
	const formatTime = (time: string): string => {
		return time.replace(':', '.');
	};

	// Return the formatted time range
	return `${formatTime(event.time_from)} – ${formatTime(event.time_to)}`;
};

/**
 * Groups events by their time range (time_from and time_to).
 * Events with the same time range are grouped together and
 * a formatted date and time range is generated for each group.
 *
 * @returns Array of grouped events with formatted date and time ranges
 * @param eventData
 */
export const groupEventsByTime = (eventData: IEventData): GroupedEvent[] => {
	// Initialize an empty array for the grouped events
	const groupedEvents: GroupedEvent[] = [];
	let currentGroup: IEvents[] = [];
	const events = eventData?.events;

	// Helper to calculate the next recurring date
	const calculateNextDate = (eventsData: IEventData, event: IEvents): string => {
		const currentDate = new Date();
		currentDate.setHours(0, 0, 0, 0);

		const startDate = parse(event.date, 'dd/MM/yyyy', new Date());
		startDate.setHours(0, 0, 0, 0);

		if (startDate.getTime() === currentDate.getTime()) {
			return format(startDate, 'dd/MM/yyyy');
		}

		let nextDate = new Date(startDate);

		while (nextDate < currentDate) {
			switch (eventsData.recurring_event) {
				case 'varjeDag':
					nextDate = addDays(nextDate, 1);
					break;
				case 'varjeVecka':
					nextDate = addWeeks(nextDate, 1);
					break;
				case 'varjeManad':
					nextDate = addMonths(nextDate, 1);
					break;
				case 'varjeAr':
					nextDate = addYears(nextDate, 1);
					break;
				default:
					return event.date;
			}
		}

		if (nextDate.getTime() === currentDate.getTime()) {
			return format(currentDate, 'dd/MM/yyyy');
		}

		return format(nextDate, 'dd/MM/yyyy');
	};

	// Iterate over each event to group them by time range
	events.forEach((event, index) => {
		// Ensure event and its time properties are defined before proceeding
		if (!event || !event.time_from || !event.time_to) {
			return; // Skip the current event if any necessary property is missing
		}

		let eventToProcess = { ...event };

		// Handle recurring events with no end date
		if (eventData.recurring_event !== 'aldrig' && eventData.ending === 'aldrig') {
			eventToProcess = { ...event, date: calculateNextDate(eventData, event) };
		}

		// If current group is empty or event's time matches the last event's time in the group, add to group
		if (
			currentGroup.length === 0 ||
			(eventToProcess.time_from === currentGroup?.[currentGroup.length - 1]?.time_from &&
				eventToProcess.time_to === currentGroup?.[currentGroup.length - 1]?.time_to)
		) {
			currentGroup.push(eventToProcess);
		} else {
			// Push the grouped events with formatted date and time ranges, then start a new group
			groupedEvents.push({
				dateRange: formatFullDateRange(currentGroup),
				timeRange: formatFullTimeRange(currentGroup[0]),
			});
			currentGroup = [eventToProcess];
		}

		// If it's the last event, ensure the remaining group is added to the result
		if (index === events.length - 1 && currentGroup.length > 0) {
			groupedEvents.push({
				dateRange: formatFullDateRange(currentGroup),
				timeRange: formatFullTimeRange(currentGroup[0]),
			});
		}
	});

	// Return the array of grouped events
	return groupedEvents;
};

export const areDatesEqual = (date1: Date | null, date2: Date | null): boolean => {
	if (!date1 || !date2) return false;

	const d1 = new Date(date1);
	const d2 = new Date(date2);

	return (
		d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate()
	);
};

export const formatedRecurringEvent = (type: RecurringEventType) => {
	const eventType = {
		aldrig: 'Aldrig upprepas',
		varjeDag: 'Upprepas varje dag', // Repeats every day
		varjeVecka: 'Upprepas varje vecka', // Repeats every week
		varjeManad: 'Upprepas varje månad', // Repeats every month
		varjeAr: 'Upprepas varje år', // Repeats every year
	};

	// Return the description for the given type, or a default message if type is not found
	return eventType[type];
};

/**
 * Formats the last event date based on a list of events, an optional ending date,
 * the number of repetitions, and the type of recurring event.
 *
 * @param events - An array of event objects containing date and time information.
 * @param endingDate - An optional string representing the ending date.
 * @param numberOfRepetitions - An optional string representing the number of repetitions.
 * @param recurringEvent - A type representing the frequency of the recurring event.
 * @param withYear - An optional boolean indicating if the year should be included in the formatted date.
 * @returns A formatted string of the last event date or null if no valid date is found.
 */
export const formatedLastEventDate = (
	events: IEvents[],
	endingDate: string | undefined,
	numberOfRepetitions: string | undefined,
	recurringEvent: RecurringEventType,
	withYear: boolean = false, // Default is false, meaning the date will not include the year
) => {
	// Function to format a date to "1 January" format
	const formatDate = (date: Date) => {
		if (withYear) {
			// Format with year (dd/MM/yyyy)
			return new Intl.DateTimeFormat('en-GB').format(date);
		}
		// Format without year (dd MMMM)
		const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
		return new Intl.DateTimeFormat('en-GB', options).format(date);
	};

	// Function to get the next date based on the event type
	const getNextDate = (date: Date, eventType: RecurringEventType) => {
		const nextDate = new Date(date);

		switch (eventType) {
			case 'varjeDag':
				nextDate.setDate(nextDate.getDate() + 1);
				break;
			case 'varjeVecka':
				nextDate.setDate(nextDate.getDate() + 7);
				break;
			case 'varjeManad':
				nextDate.setMonth(nextDate.getMonth() + 1);
				break;
			case 'varjeAr':
				nextDate.setFullYear(nextDate.getFullYear() + 1);
				break;
		}
		return nextDate;
	};

	// Function to get the last valid event date before the specified ending date
	const getLastEventBeforeEndingDate = (
		startDate: Date,
		endDate: Date,
		eventType: RecurringEventType,
	) => {
		let currentDate = new Date(startDate);
		let lastValidDate = currentDate;

		// Loop to find the last valid date before the ending date
		while (currentDate <= endDate) {
			lastValidDate = currentDate;
			currentDate = getNextDate(currentDate, eventType);
		}

		return endDate >= lastValidDate ? endDate : lastValidDate;
	};

	// Function to get the last event date based on the number of repetitions
	const getLastEventByRepetitions = (
		startDate: Date,
		repetitions: number,
		eventType: RecurringEventType,
	) => {
		let currentDate = new Date(startDate);

		// Loop to calculate the date based on the number of repetitions
		for (let i = 1; i < repetitions; i++) {
			currentDate = getNextDate(currentDate, eventType);
		}

		return currentDate;
	};

	let lastDate: Date | null = null; // Variable to store the latest date

	// Loop through each event to determine the last valid date
	for (const event of events) {
		const startDate = new Date(event.date.split('/').reverse().join('/'));

		let calculatedDate: Date | null = null;

		if (endingDate) {
			const endDate = new Date(endingDate.split('/').reverse().join('/'));
			calculatedDate = getLastEventBeforeEndingDate(startDate, endDate, recurringEvent);
		}

		if (numberOfRepetitions) {
			const repetitions = parseInt(numberOfRepetitions, 10);
			const lastEventByReps = getLastEventByRepetitions(
				startDate,
				repetitions,
				recurringEvent,
			);

			// Compare with the previously found date
			if (!calculatedDate || lastEventByReps > calculatedDate) {
				calculatedDate = lastEventByReps;
			}
		} else if (!calculatedDate) {
			calculatedDate = startDate; // If no ending date and no repetitions
		}

		// Compare with the latest found date
		if (calculatedDate && (!lastDate || calculatedDate > lastDate)) {
			lastDate = calculatedDate;
		}
	}

	return lastDate ? formatDate(lastDate) : null; // Return the latest date or null
};

export const getSortedEvents = (data: IEventData[] | null | undefined) => {
	if (!data || !Array.isArray(data)) return [];

	const parseDate = (dateStr: string) => parse(dateStr, 'dd/MM/yyyy', new Date());

	const today = new Date().toLocaleDateString('en-GB');

	const filteredEvents = data.filter((event) => {
		const { ending, recurring_event, events } = event;

		if (ending !== 'aldrig' || recurring_event !== 'aldrig') {
			const endDate = formatedLastEventDate(
				event?.events,
				event?.ending_date,
				event?.number_of_repetitions,
				event?.recurring_event,
				true,
			);

			const endDateParsed = endDate && parseDate(endDate);
			const todayParsed = parseDate(today);

			return !(endDateParsed && endDateParsed < todayParsed);
		}

		if (!events || events.length === 0) {
			return true;
		}

		const lastEventDate = events[events.length - 1]?.date;

		const lastEventDateParsed = lastEventDate && parseDate(lastEventDate);

		return lastEventDateParsed && lastEventDateParsed >= parseDate(today);
	});

	return filteredEvents.sort((a, b) => {
		const nextEventA = a.events?.[0]?.date;
		const nextEventB = b.events?.[0]?.date;

		const dateA = nextEventA ? parseDate(nextEventA) : new Date(0);
		const dateB = nextEventB ? parseDate(nextEventB) : new Date(0);

		return dateA.getTime() - dateB.getTime();
	});
};

export const addTargetSvg = (html: string, color: string = '#685BC7'): string => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	doc.querySelectorAll('a[target]').forEach((a) => {
		const anchor = a as HTMLAnchorElement;
		anchor.classList.add('custom-target');
		anchor.style.color = color;

		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('width', '18');
		svg.setAttribute('height', '18');
		svg.setAttribute('viewBox', '0 0 18 18');
		svg.setAttribute('fill', 'none');
		svg.innerHTML = `
			<g id="external-link">
				<path id="Vector" d="M8.25 5.25H4.5C4.10218 5.25 3.72064 5.40804 3.43934 5.68934C3.15804 5.97064 3 6.35218 3 6.75V13.5C3 13.8978 3.15804 14.2794 3.43934 14.5607C3.72064 14.842 4.10218 15 4.5 15H11.25C11.6478 15 12.0294 14.842 12.3107 14.5607C12.592 14.2794 12.75 13.8978 12.75 13.5V9.75M7.5 10.5L15 3M15 3H11.25M15 3V6.75" 
					stroke="${color}" 
					stroke-width="1.5" 
					stroke-linecap="round" 
					stroke-linejoin="round"/>
			</g>
		`;

		a.appendChild(svg);
	});
	return doc.body.innerHTML;
};

export const hexToRgba = (hex: string, alpha: number): string => {
	const sanitizedHex = hex?.replace(/^#/, '');

	const fullHex =
		sanitizedHex?.length === 3
			? sanitizedHex
					.split('')
					.map((char) => char + char)
					.join('')
			: sanitizedHex;

	const r = parseInt(fullHex?.substring(0, 2), 16);
	const g = parseInt(fullHex?.substring(2, 4), 16);
	const b = parseInt(fullHex?.substring(4, 6), 16);

	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
