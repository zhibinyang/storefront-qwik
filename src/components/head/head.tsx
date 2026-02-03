import { component$ } from '@qwik.dev/core';
import { useDocumentHead, useLocation } from '@qwik.dev/router';
import { DEFAULT_METADATA_TITLE } from '~/constants';
import { generateDocumentHead } from '~/utils';

export const Head = component$(() => {
	const documentHead = useDocumentHead();
	const head =
		documentHead.meta.length > 0 ? documentHead : { ...documentHead, ...generateDocumentHead() };
	const loc = useLocation();

	return (
		<head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta name="theme-color" content="#1D4ED8" />
			<script
				dangerouslySetInnerHTML={`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-P2698LFP');
          `}
			/>
			<title>{head.title || DEFAULT_METADATA_TITLE}</title>

			<link rel="manifest" href="/manifest.json" />
			<link rel="apple-touch-icon" href="/logo-192-192.png" />
			<link rel="preconnect" href="https://demo.vendure.io" />
			<link rel="canonical" href={loc.url.toString()} />

			{head.meta.map((m, key) => (
				<meta key={key} {...m} />
			))}

			{head.links.map((l, key) => (
				<link key={key} {...l} />
			))}

			{head.styles.map(({ key, style, ...props }) => (
				<style key={key} {...props} dangerouslySetInnerHTML={style} />
			))}

			<meta name="description" content="Vendure Qwik Storefront" />
		</head>
	);
});
