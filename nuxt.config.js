// https://nuxt.com/docs/api/configuration/nuxt-config

let config;

const config_default_options = {
	devtools: { enabled: true },
	modules: [
		// @sidebase/nuxt-auth',
		'@nuxtjs/tailwindcss',
		'nuxt-icon',
		'@nuxtjs/eslint-module',
		'@nuxt/content'
	],
	typescript: {
		strict: true,
		default: true
	},
	auth: {
		provider: {
			type: 'authjs'
		}
	},
	app: {
		head: {
			title: 'Atom',
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ hid: 'description', name: 'description', content: 'The Atom web proxy' }
			],
			script: [
				{ src: '/cyrillic_obfuscation/index.js' },
				{ src: '/ultraviolet/uv.helpers.js' }
			],
			link: [
				{ rel: 'icon', href: '/atom.svg' }
			],
			htmlAttrs: {
				lang: 'en'
			}
		}
	},
	nitro: {
		compressPublicAssets: true
	}
};

const config_prod_addins = {
	nitro: {
		compressPublicAssets: true,
		routeRules: {
			'/ultraviolet/**': {
				headers: {
					'cache-control': 'public, max-age=864000'
				}
			}
		}
	}
};

if (process.env.NODE_ENV === 'production') {
	config = {
		...config_default_options,
		...config_prod_addins
	};
} else {
	config = config_default_options;
}

export default defineNuxtConfig(config);