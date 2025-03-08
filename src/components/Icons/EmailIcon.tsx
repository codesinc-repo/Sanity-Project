import React from 'react';

import type { IIconsProps } from '@/helpers/global.interface';

const EmailIcon: React.FC<IIconsProps> = ({
	className,
	onClick,
	style,
	width = 20,
	height = 20,
	fill = '#AE8BF4',
}) => {
	return (
		<svg
			className={className}
			style={{ ...style }}
			width={width}
			onClick={onClick}
			height={height}
			viewBox="0 0 20 20"
			fill="none"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3.42682 5.44966L10.0001 9.83183L16.5733 5.44966C16.4345 5.18252 16.1553 5.00004 15.8334 5.00004H4.16675C3.84488 5.00004 3.56564 5.18252 3.42682 5.44966ZM16.6667 7.39047L10.4623 11.5267C10.1824 11.7134 9.81775 11.7134 9.53783 11.5267L3.33341 7.39047V14.1667C3.33341 14.6269 3.70651 15 4.16675 15H15.8334C16.2937 15 16.6667 14.6269 16.6667 14.1667V7.39047ZM1.66675 5.83337C1.66675 4.45266 2.78604 3.33337 4.16675 3.33337H15.8334C17.2141 3.33337 18.3334 4.45266 18.3334 5.83337V14.1667C18.3334 15.5474 17.2141 16.6667 15.8334 16.6667H4.16675C2.78604 16.6667 1.66675 15.5474 1.66675 14.1667V5.83337Z"
				fill={fill}
			/>
		</svg>
	);
};

export default EmailIcon;
