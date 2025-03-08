import React from 'react';

import type { IIconsProps } from '@/helpers/global.interface';

const ArrowRightIcon: React.FC<IIconsProps> = ({
	className,
	onClick,
	style,
	width = 24,
	height = 24,
	fill = '#685BC7',
}) => {
	return (
		<svg
			className={className}
			style={{ ...style }}
			width={width}
			onClick={onClick}
			height={height}
			viewBox="0 0 24 24"
			fill="none"
		>
			<path
				d="M5 12H19M19 12L15 16M19 12L15 8"
				stroke={fill}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default ArrowRightIcon;
