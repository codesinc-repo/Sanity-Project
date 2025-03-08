import React from 'react';

import type { IIconsProps } from '@/helpers/global.interface';

const CounterIcon: React.FC<IIconsProps> = ({
	className,
	onClick,
	style,
	width = 32,
	height = 32,
}) => {
	return (
		<svg
			style={{ ...style }}
			onClick={onClick}
			className={className}
			width={width}
			height={height}
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M4 22.6668L5.33333 22.6668M26.6667 22.6668L28 22.6668M7.46667 14.1335L8.4 15.0668M24.5333 14.1335L23.6 15.0668M10.6667 22.6668C10.6667 21.2523 11.2286 19.8958 12.2288 18.8956C13.229 17.8954 14.5855 17.3335 16 17.3335C17.4145 17.3335 18.771 17.8954 19.7712 18.8956C20.7714 19.8958 21.3333 21.2523 21.3333 22.6668M4 28L28 28M16 4L16 12M16 12L20 8M16 12L12 8"
				stroke="#685BC7"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default CounterIcon;
