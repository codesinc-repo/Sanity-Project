'use client';

import type { FC } from 'react';
import React from 'react';

interface ISvg {
	className?: string;
	width?: number | 'auto';
	height?: number | 'auto';
	style?: string;
	svg?: string;
}

const CustomSvg: FC<ISvg> = ({ className, style, width = 'auto', height = 'auto', svg }) => {
	return (
		svg && (
			<span
				style={{ width, height, display: 'inline-block' }}
				className={className}
				data-fill={style}
				dangerouslySetInnerHTML={{ __html: svg }}
			/>
		)
	);
};

export default CustomSvg;
