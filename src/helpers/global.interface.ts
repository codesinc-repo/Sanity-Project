import type { CSSProperties } from 'react';

export type RecurringEventType = 'aldrig' | 'varjeDag' | 'varjeVecka' | 'varjeManad' | 'varjeAr';
export type FieldType =
	| 'TEXT'
	| 'PHONE'
	| 'EMAIL'
	| 'POST_EXCERPT'
	| 'NUMBER'
	| 'SELECT'
	| 'RADIO'
	| 'CHECKBOX'
	| 'MULTI_SELECT';

export type FormFieldsType = Record<string, (value: any) => string | undefined>;

export type InitialValuesType = Record<string, string>;

export interface IEventFormSteps {
	first_step: {
		label: string;
		buttons: { cancel_label: string; next_label: string };
		activity_name_field: IEventFormField;
		address_field: IEventFormField;
		contact_person_field: IEventFormField;
		description_field: IEventFormField;
		email_address_field: IEventFormField;
		organiserplace_field: IEventFormField;
		phone_number_field: IEventFormField;
		select_category_field: { label: string; is_required: boolean; error_text: string };
		upload_image_field: {
			button_title: string;
			description: string;
			label: string;
		};
	};
	second_step: {
		label: string;
		buttons: { cancel_label: string; next_label: string };
		calendar: { label: string };
		time_block: {
			checkbox_label: string;
			end_time: string;
			start_time: string;
			label: string;
			recurring_event: {
				label: string;
				options: {
					label: string;
					value: string;
				}[];
			};
			ending: {
				label: string;
				options: {
					label: string;
					value: string;
				}[];
			};
			ending_date: {
				label: string;
			};
			number_of_repetitions: {
				label: string;
				count: number;
			};
		};
	};
	third_step: {
		block_info: {
			first_label: string;
			second_label: string;
			button_title: string;
		};
		buttons: { cancel_label: string; next_label: string };
		description: string;
		label: string;
	};
}

interface IEventFormField {
	label: string;
	placeholder: string;
	is_required: boolean;
	error_text: string;
}

export interface Holiday {
	closing: string;
	endHolidays: string | null;
	opening: string;
	startHolidays: string;
}

export interface StoreHours {
	weekDays: { opening: string; closing: string };
	saturday: { opening: string; closing: string };
	sunday: { opening: string; closing: string };
	holidays: Holiday[];
}

export interface IImage {
	url: string;
	title: string;
	svg: string;
	sourceUrl?: string;
}

export interface IImageTS {
	node: {
		sourceUrl: string;
		title: string;
	};
}

export interface IEventsPosts {
	posts: IEventData[];
	totalCount: number;
}

export interface IEventData {
	address: string;
	categories: {
		name: string;
		slug: string;
	}[];
	ending: string;
	ending_date: string;
	events: IEvents[];
	excerpt: string;
	email: string;
	featuredImage: IImageTS;
	location: string;
	number_of_repetitions: string;
	organiser: string;
	phone: string;
	recurring_event: RecurringEventType;
	slug: string;
	title: string;
}

export interface GroupedEvent {
	dateRange: string;
	timeRange: string;
}

export interface ProcessedEvent extends IEventData {
	dateTimeFrom: Date;
	dateTimeTo: Date;
}

export interface IEvents {
	date: string;
	time_from: string;
	time_to: string;
}

export interface ILink {
	title: string;
	url: string;
	target: string;
}

export interface IButton {
	title: string;
	url: string;
	target: string;
}

export interface IPage {
	title: string;
	slug: string;
}

export interface IButtonOptions {
	button: IButton;
	variant: 'filled';
	color: 'violet' | 'darkRed' | 'yellow';
	icon?: IImage;
	icon_color?: string;
	iconColor?: string;
	text?: string;
}

export interface IIconOptions {
	item_text: string;
	item_desc?: string;
	item_icon: IImage;
	icon_color: string;
	background_color?: string;
	text_color?: string;
	image?: IImage;
	item_link?: IButton;
}

export interface IItemOptions {
	item_text: string;
	item_desc: string;
}

export interface IFormFields {
	type: FieldType;
	name: string;
	newName?: string;
	choices?: { text?: string; value: string }[] | string[];
	isPasswordInput?: boolean;
	isRequired?: boolean;
	className: string;
	label?: string;
	icon?: string;
	defaultValue?: string;
	placeholder?: string;
	classNameWrap?: string;
	classNameText?: string;
	value?: boolean;
	handleClick?: () => {};
	isMobile?: boolean;
	text?: string;
	size?: string;
}

export interface IPost {
	slug: string;
	title: string;
	postId: number;
	author: {
		node: {
			name: string;
		};
	};
	categories: {
		nodes: [
			{
				categoryId: number;
				name: string;
				slug: string;
			},
		];
	};
	excerpt: string;
	featuredImage: {
		node: {
			title: string;
			sourceUrl: string;
		};
	};
	date: string;
}

export interface IGravityForms {
	formId: number;
	title: string;
	formFields: {
		nodes: {
			id: number;
			isRequired: boolean;
			label?: string;
			size?: string;
			placeholder?: string;
			className?: string | undefined;
			defaultValue?: string;
			isPasswordInput?: boolean;
			type: FieldType;
			choices: { text?: string; value: string }[] | string[];
		}[];
	};
}

export interface IInputIcon {
	input_id?: string;
	inputId?: string;
	icon: IImage;
}

export interface IOpeningHoursItem {
	time: string;
	title: string;
}

export interface IIconsProps {
	className?: string;
	style?: CSSProperties;
	width?: number;
	widthStroke?: number;
	height?: number;
	fill?: string;
	borderFill?: string;
	showRect?: boolean;
	active?: boolean;
	onClick?: () => void;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	stepStatus?: 'default' | 'active' | 'passed';
}

export interface IEventsCategories {
	id: number;
	name: string;
	slug: string;
	description: string;
	count: number;
}
