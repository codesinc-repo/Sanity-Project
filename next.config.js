module.exports = {
	trailingSlash: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		dangerouslyAllowSVG: true,
		contentDispositionType: 'attachment',
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
		formats: ['image/webp'],
		remotePatterns: [
			{
				hostname: 'localhost',
			},
			{
				hostname: 'api-gottsunda.upwego.se',
			},
			{
				hostname: 'api-dev-gottsunda.upwego.se',
			},
		],
	},
};
