import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: '../production/infoscreenFrontendSvelte',
			assets: '../production/infoscreenFrontendSvelte',
			fallback: 'index.html',
			precompress: false,
			strict: false
		}),
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/svelte' : ''
		},
		alias: {
			$components: './src/components',
			$stores: './src/stores',
			$utils: './src/utils',
			$types: './src/types'
		}
	}
};

export default config;
