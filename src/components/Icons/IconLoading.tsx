import React from 'react';

const IconLoading = ({
	color = '#685BC7',
	className = '',
}: {
	color?: string;
	className?: string;
}) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 200 200"
			width="30"
			height="30"
			className={className}
		>
			<defs>
				<radialGradient
					id="a11"
					cx="0.66"
					fx="0.66"
					cy="0.3125"
					fy="0.3125"
					gradientTransform="scale(1.5)"
				>
					<stop offset="0" stopColor={color} />
					<stop offset="0.3" stopColor={color} stopOpacity="0.9" />
					<stop offset="0.6" stopColor={color} stopOpacity="0.6" />
					<stop offset="0.8" stopColor={color} stopOpacity="0.3" />
					<stop offset="1" stopColor={color} stopOpacity="0" />
				</radialGradient>
			</defs>

			<circle
				fill="none"
				stroke="url(#a11)"
				strokeWidth="15"
				strokeLinecap="round"
				strokeDasharray="200 1000"
				strokeDashoffset="0"
				cx="100"
				cy="100"
				r="70"
				// @ts-ignore
				transformOrigin="center"
			>
				<animateTransform
					type="rotate"
					attributeName="transform"
					calcMode="spline"
					dur="2s"
					values="360;0"
					keyTimes="0;1"
					keySplines="0 0 1 1"
					repeatCount="indefinite"
				/>
			</circle>

			<circle
				fill="none"
				opacity="0.2"
				stroke={color}
				strokeWidth="15"
				strokeLinecap="round"
				cx="100"
				cy="100"
				r="70"
				// @ts-ignore
				transformOrigin="center"
			/>
		</svg>
	);
};

export default IconLoading;
