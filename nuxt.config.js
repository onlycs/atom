// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: [
		'@sidebase/nuxt-auth',
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
			script: [
				{ src: '/ultraviolet/uv.bundle.js' },
				{ src: '/ultraviolet/uv.config.js' },
				{ src: '/ultraviolet/uv.helpers.js' },
				{ src: '/cyrillic_obfuscation/index.js' }
			],
			title: 'Atom',
			link: [
				{ rel: 'icon', href: '/atom.svg' }
			]
		}
	}
});