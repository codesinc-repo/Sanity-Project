import React from 'react';

import type { IIconsProps } from '@/helpers/global.interface';

const IconExternalLink: React.FC<IIconsProps> = ({
	className,
	onClick,
	style,
	width = 18,
	height = 18,
	fill = '#685BC7',
}) => {
	return (
		<svg
			className={className}
			style={{ ...style }}
			width={width}
			onClick={onClick}
			height={height}
			viewBox="0 0 18 18"
			fill="none"
		>
			<path
				d="M8.25 5.25H4.5C4.10218 5.25 3.72064 5.40804 3.43934 5.68934C3.15804 5.97064 3 6.35218 3 6.75V13.5C3 13.8978 3.15804 14.2794 3.43934 14.5607C3.72064 14.842 4.10218 15 4.5 15H11.25C11.6478 15 12.0294 14.842 12.3107 14.5607C12.592 14.2794 12.75 13.8978 12.75 13.5V9.75M7.5 10.5L15 3M15 3H11.25M15 3V6.75"
				stroke={fill}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default IconExternalLink;
