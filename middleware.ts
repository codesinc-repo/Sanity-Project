import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { redirectsOptions } from '@/lib/redirectsOptions';

import { i18n } from './i18n-config';

interface IRedirect {
	from: string;
	to: string;
	statusCode: string;
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get('gottsundaAuthToken')?.value || '';
	const currentLang = request.cookies.get('gottsundaCurrentLang')?.value || i18n.defaultLocale;

	// Retrieve redirects and apply if a match is found
	const redirects: IRedirect[] = await redirectsOptions();
	const redirect = redirects?.length !== 0 && redirects?.find((r) => r.from === pathname);
	if (redirect) {
		try {
			return NextResponse.redirect(new URL(redirect.to, request.url).toString(), {
				status: +redirect.statusCode,
			});
		} catch (error) {
			console.error('Error creating a new URL:', error);
		}
	}

	// Check if pathname is missing locale or matches the root path
	const isRootPath = pathname === `/${currentLang}` || pathname === `/${currentLang}/`;
	const pathnameIsMissingLocale = !pathname.startsWith(`/${currentLang}/`);

	if (pathnameIsMissingLocale) {
		return NextResponse.redirect(new URL(`/${currentLang}${pathname}`, request.url));
	}

	if (isRootPath) {
		return NextResponse.redirect(new URL(`/${currentLang}/home`, request.url));
	}

	// Define public and auth paths
	const publicPaths = [
		`/${currentLang}/kalender/instrumentpanelen/`,
		`/${currentLang}/kalender/instrumentpanelen/ny-aktivitet/`,
	];

	const authPaths = [
		`/${currentLang}/kalender/inloggning/`,
		`/${currentLang}/kalender/registrering/`,
	];
	console.log('authPaths', authPaths);
	console.log('pathname', pathname);

	// Redirect based on token presence and path type
	if (!token) {
		if (publicPaths.includes(pathname)) {
			return NextResponse.redirect(
				new URL(`/${currentLang}/kalender/inloggning/`, request.url),
			);
		}
	} else if (token && authPaths.includes(pathname)) {
		return NextResponse.redirect(
			new URL(`/${currentLang}/kalender/instrumentpanelen/`, request.url),
		);
	}

	// Add custom header and proceed
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set('x-pathname', request.url);

	return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
	// Matcher ignoring `/_next/` and `/api/`
	matcher: ['/((?!api|_next/static|_next/image|audio|images|assets|favicon.ico).*)'],
};
