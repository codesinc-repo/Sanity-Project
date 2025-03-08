import React from 'react';

import type { IIconsProps } from '@/helpers/global.interface';

const AlarmIcon: React.FC<IIconsProps> = ({
	className,
	onClick,
	style,
	width = 20,
	height = 21,
	fill = 'white',
}) => {
	return (
		<svg
			className={className}
			style={{ ...style }}
			width={width}
			onClick={onClick}
			height={height}
			viewBox="0 0 20 21"
			fill="none"
		>
			<path
				d="M10.0001 8.8335V11.3335H11.6667M5.83341 3.8335L3.54175 5.50016M14.1667 3.8335L16.4584 5.50016M15.8334 11.3335C15.8334 14.5552 13.2217 17.1668 10.0001 17.1668C6.77842 17.1668 4.16675 14.5552 4.16675 11.3335C4.16675 8.11183 6.77842 5.50016 10.0001 5.50016C13.2217 5.50016 15.8334 8.11183 15.8334 11.3335Z"
				stroke={fill}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default AlarmIcon;
