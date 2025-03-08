import React from 'react';

import type { IIconsProps } from '@/helpers/global.interface';

const IconRemove: React.FC<IIconsProps> = ({
	className,
	onClick,
	style,
	width = 20,
	height = 20,
	fill = 'white',
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
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect width="20" height="20" rx="10" fill="black" />
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M10.0013 3.33073C6.3194 3.33073 3.33464 6.3155 3.33464 9.9974C3.33464 13.6793 6.3194 16.6641 10.0013 16.6641C13.6832 16.6641 16.668 13.6793 16.668 9.9974C16.668 6.3155 13.6832 3.33073 10.0013 3.33073ZM1.66797 9.9974C1.66797 5.39502 5.39893 1.66406 10.0013 1.66406C14.6037 1.66406 18.3346 5.39502 18.3346 9.9974C18.3346 14.5998 14.6037 18.3307 10.0013 18.3307C5.39893 18.3307 1.66797 14.5998 1.66797 9.9974ZM6.66797 9.9974C6.66797 9.53716 7.04107 9.16406 7.5013 9.16406H12.5013C12.9615 9.16406 13.3346 9.53716 13.3346 9.9974C13.3346 10.4576 12.9615 10.8307 12.5013 10.8307H7.5013C7.04107 10.8307 6.66797 10.4576 6.66797 9.9974Z"
				fill={fill}
			/>
		</svg>
	);
};

export default IconRemove;
