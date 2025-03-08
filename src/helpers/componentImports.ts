import dynamic from 'next/dynamic';

const components = [
	'HeroBanner',
	'AfterBanner',
	'HighlightsBlock',
	'HeroBlock',
	'CustomerReview',
	'CustomWysiwygEditor',
	'BlogBlock',
	'GalleryBlock',
	'ContactUs',
	'ServiceCards',
	'NewsletterQuickBlock',
	'EventsBlock',
	'ActivitiesBlock',
	'TeamBlock',
	'AboutUs',
	'InfoColumn',
	'SimpleHeroBlock',
	'SustainabilityPromise',
	'Faq',
	'OpeningHours',
	'MenuBlock',
	'Statistics',
	'RegistrationFormBlock',
	'LoginFormBlock',
	'TextWithButtonBlock',
	'EventFormBlock',
	'ForgotPasswordFormBlock',
	'LatestEventsBlock',
	'SimpleFaqBlock',
	'HolidayHeroBannerBlock',
	'RamadanBlock',
];

export const componentImports = components.reduce(
	(acc, component) => {
		acc[component] = dynamic(() => import(`@/components/blocks/${component}`));
		return acc;
	},
	{} as Record<string, any>,
);
