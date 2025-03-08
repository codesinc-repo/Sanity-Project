'use client';

import type { MantineThemeOverride } from '@mantine/core';
import { Container, createTheme, rem } from '@mantine/core';
import { themeToVars } from '@mantine/vanilla-extract';

const CONTAINER_SIZES: Record<string, string> = {
	xxs: rem(300),
	xs: rem(540),
	sm: rem(720),
	md: rem(904),
	lg: rem(1140),
	xl: rem(1360),
	xxl: rem(900),
};

export const theme: MantineThemeOverride = createTheme({
	fontFamily: 'var(--font-archivo)',
	components: {
		Container: Container.extend({
			vars: (_, { size, fluid }) => ({
				root: {
					'--container-size': fluid
						? '100%'
						: size !== undefined && size in CONTAINER_SIZES
							? CONTAINER_SIZES[size]
							: rem(size),
				},
			}),
		}),
	},
	spacing: {
		xs: rem(10),
		sm: rem(12),
		md: rem(16),
		lg: rem(20),
		xl: rem(24),
	},
	headings: {
		fontFamily: 'var(--font-monument)',
		sizes: {
			h1: {
				fontSize: rem(58),
				fontWeight: '700',
				lineHeight: '1.2',
			},
			h2: {
				fontSize: rem(40),
				lineHeight: '1.2',
				fontWeight: '700',
			},
			h3: {
				fontSize: rem(32),
				lineHeight: '1.25',
				fontWeight: '700',
			},
			h4: {
				fontSize: rem(24),
				lineHeight: '1.2',
				fontWeight: '700',
			},
			h5: {
				fontSize: rem(20),
				lineHeight: '1.2',
				fontWeight: '700',
			},
			h6: {
				fontSize: rem(14),
				lineHeight: '1.5',
				fontWeight: '700',
			},
		},
	},
});
export const vars = themeToVars(theme);
