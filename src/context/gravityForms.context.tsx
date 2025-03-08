'use client';

import type { Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useState } from 'react';

import type { IGravityForms } from '@/helpers/global.interface';

interface IGravityFormsContextProps {
	gravityForms: IGravityForms[];
	setGravityFormsSettings: Dispatch<SetStateAction<IGravityForms>>;
}

const GravityFormsContext = createContext<IGravityFormsContextProps>(
	{} as IGravityFormsContextProps,
);

export const GravityFormsContextProvider = ({
	children,
	value,
}: {
	children: React.ReactNode;
	value: any;
}) => {
	const [gravityForms, setGravityFormsSettings] = useState(value);

	return (
		<GravityFormsContext.Provider
			value={{
				gravityForms,
				setGravityFormsSettings,
			}}
		>
			{children}
		</GravityFormsContext.Provider>
	);
};

export const useGravityFormsContext = () => useContext(GravityFormsContext);
