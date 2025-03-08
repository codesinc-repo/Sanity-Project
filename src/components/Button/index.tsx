'use client';

import { Button } from '@mantine/core';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

import IconLoading from '@/components/Icons/IconLoading';
import Svg from '@/components/Svg';
import type { IButtonOptions } from '@/helpers/global.interface';

import classes from './Button.module.css';

interface CustomButtonProps {
	button: IButtonOptions[];
	size?: 'small' | 'big';
	isSubmitBtn?: boolean;
	isLoading?: boolean;
	className?: string;
	checkboxValue?: boolean;
	onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, btn: IButtonOptions) => void;
}

const CustomButton = ({
	button,
	isLoading = false,
	isSubmitBtn = false,
	checkboxValue = false,
	size = 'small',
	className = '',
	onClick = () => {},
}: CustomButtonProps) => {
	const pathname = usePathname();

	const locale = pathname.includes('/en/') ? 'en' : 'sv';

	const [loadingStates, setLoadingStates] = useState<boolean[]>(
		new Array(button.length).fill(false),
	);

	const variantClasses = {
		filled: classes.filled,
		onlyBorder: classes.onlyBorder,
	};

	const colorClasses = {
		violet: classes.violet,
		darkRed: classes.darkRed,
		yellow: classes.yellow,
	};

	const sizeClasses = {
		small: classes.small,
		big: classes.big,
	};

	const handleClick = (
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
		btn: IButtonOptions,
		index: number,
	) => {
		// Set loading state for the specific button
		const newLoadingStates = [...loadingStates];
		newLoadingStates[index] = true;
		setLoadingStates(newLoadingStates);

		// Simulate async operation or handle onClick
		onClick(event, btn);

		// // Reset loading state after operation
		setTimeout(() => {
			newLoadingStates[index] = false;
			setLoadingStates(newLoadingStates);
		}, 5000);
	};

	return (
		button &&
		button?.map((btn, index) => {
			const buttonClass = classNames(
				classes.control,
				variantClasses[btn.variant],
				colorClasses[btn.color],
				className,
			);

			const isLoadingStates =
				loadingStates[index] &&
				(btn?.button?.url?.startsWith('/') || btn?.button?.url?.startsWith('#'));

			return isSubmitBtn ? (
				<Button
					key={index}
					type="submit"
					className={`${buttonClass} ${sizeClasses[size]} ${isLoading ? classes.loading : ''}`}
					disabled={checkboxValue}
				>
					{btn?.text}
					{isLoading && <IconLoading className={classes.loadingIcon} color={'#000000'} />}
				</Button>
			) : (
				<Button
					key={index}
					component={Link}
					href={
						btn?.button?.url?.startsWith('/')
							? `/${locale}${btn.button.url}`
							: btn.button.url
					}
					target={btn?.button?.url?.includes('http') ? '_blank' : '_self'}
					className={`${buttonClass} ${sizeClasses[size]} ${isLoadingStates ? classes.loading : ''}`}
					onClick={(event) => handleClick(event, btn, index)}
					leftSection={
						btn?.icon?.svg ? (
							<Svg
								className={classes.controlIcon}
								svg={btn?.icon?.svg || ''}
								style={btn?.icon_color}
								width={size === 'big' ? 24 : 20}
								height={size === 'big' ? 24 : 20}
							/>
						) : null
					}
				>
					{btn.button.title}
					{isLoadingStates && (
						<IconLoading className={classes.loadingIcon} color={'#000000'} />
					)}
				</Button>
			);
		})
	);
};

export default CustomButton;
