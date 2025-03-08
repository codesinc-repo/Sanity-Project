import React from 'react';

import type { IIconsProps } from '@/helpers/global.interface';

const IconHolidaySnow: React.FC<IIconsProps> = ({
	className,
	onClick,
	style,
	width = 1728,
	height = 131,
	fill = 'white',
}) => {
	return (
		<svg
			className={className}
			style={{ ...style }}
			width={width}
			onClick={onClick}
			height={height}
			viewBox="0 0 1728 131"
			preserveAspectRatio="xMidYMax meet"
			fill="none"
		>
			<path
				d="M2571.26 51.2671C2722.88 16.3021 2787.24 23.8621 2985.48 82.1371V127.917L-1002 130.017V51.2671C-945.649 27.9571 -798.573 -14.0009 -661.064 4.64708C-489.179 27.9571 -305.429 51.2671 -150.974 51.2671C3.48047 51.2671 166.756 1.70708 324.151 4.64708C481.546 7.58708 484.381 51.2671 600.931 51.2671C717.48 51.2671 790.456 103.767 933.256 100.827C1076.06 97.8871 1084.77 51.2671 1259.7 51.2671C1434.63 51.2671 1463.72 86.2321 1667.73 86.2321C1871.75 86.2321 1938.74 33.8371 2128.16 51.2671C2317.58 68.6971 2419.64 86.2321 2571.26 51.2671Z"
				fill={fill}
			/>
		</svg>
	);
};

export default IconHolidaySnow;
