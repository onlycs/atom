import { MetaObject } from 'nuxt/schema';

export function useSetHead(page: string, desc: string): MetaObject {
	const { settings, save_cookie, update_setting, default_settings } = useSettings();

	if (settings.value.tab_mask.title == '') {
		update_setting('tab_mask', {
			title: default_settings.tab_mask.title,
			icon: settings.value.tab_mask.icon,
			description: settings.value.tab_mask.description
		});
	}

	if (settings.value.tab_mask.icon == '') {
		update_setting('tab_mask', {
			title: settings.value.tab_mask.title,
			icon: default_settings.tab_mask.icon,
			description: settings.value.tab_mask.description
		});
	}

	save_cookie();

	const title = settings.value.tab_mask.title.replace('%p', page);
	const icon = settings.value.tab_mask.icon;

	if (settings.value.tab_mask.description) {
		return {
			title,
			link: [
				{ rel: 'icon', href: icon }
			],
			meta: [
				{ hid: 'description', name: 'description', content: desc }
			]
		};
	}

	return {
		title,
		link: [
			{ rel: 'icon', href: icon }
		]
	};
}