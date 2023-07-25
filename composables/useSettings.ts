import { v4 as randomUUID } from 'uuid';
import { xor } from '~/utils/xor';
import { createCheckers } from 'ts-interface-checker';
import InterfaceChecks from '~/utils/validators';

const { Settings, SearchEngine } = createCheckers(InterfaceChecks);

export interface SearchEngine {
	id: string;
	name: string;
	url: string;
	logo_name: string;
	default?: boolean;
	can_delete: boolean;
}

export interface Settings {
	engines: SearchEngine[],
	tab_mask: {
		title: string,
		icon: string,
		description: boolean
	}
}

export const default_settings: Settings = {
	engines: [
		{
			id: randomUUID(),
			name: 'Google',
			url: 'https://www.google.com/search?q=%q',
			logo_name: 'arcticons:google-alt',
			default: true,
			can_delete: false
		},
		{
			id: randomUUID(),
			name: 'Bing',
			url: 'https://www.bing.com/search?q=%q',
			logo_name: 'arcticons:microsoftbing-alt',
			can_delete: true
		},
		{
			id: randomUUID(),
			name: 'DuckDuckGo',
			url: 'https://duckduckgo.com/?q=%q',
			logo_name: 'arcticons:duckduckgo',
			can_delete: true
		}
	],
	tab_mask: {
		title: 'Atom | %p',
		icon: '/atom.svg',
		description: true
	}
};

export function useSettings() {
	const settings = useState<Settings>('settings', () => {
		const cookie = useCookie<Settings>('settings', {
			encode(value) {
				return encodeURIComponent(xor.encode(JSON.stringify(value)));
			},
			decode(value) {
				return JSON.parse(xor.decode(decodeURIComponent(value)));
			},
			default() {
				return default_settings;
			},
			maxAge: 60 * 60 * 24 * 365
		});

		// todo: do full validation
		if (!Settings.test(cookie.value)) {
			cookie.value = default_settings;
		}


		return {
			...cookie.value
		};
	});

	function update_setting<K extends keyof Settings>(key: K, value: Settings[K]) {
		settings.value = {
			...settings.value,
			[key]: value
		};
	}

	function update_engine<K extends keyof SearchEngine>(id: string, key: K, value: SearchEngine[K]) {
		let engines = [...settings.value.engines];
		const index = engines.findIndex(e => e.id == id);
		engines[index][key] = value;
		update_setting('engines', engines);
	}

	function delete_engine(id: string) {
		let engines = [...settings.value.engines];
		engines = engines.filter(e => e.id != id);
		update_setting('engines', engines);
		save_cookie();
	}

	function add_engine() {
		let engines = [...settings.value.engines];
		engines.push({
			id: randomUUID(),
			name: 'Custom Engine',
			url: 'https://example.com/search?q=%q',
			logo_name: 'ph:globe-light',
			can_delete: true
		});
		update_setting('engines', engines);
		save_cookie();
	}

	function save_cookie() {
		const cookie = useCookie<Settings>('settings', {
			encode(value) {
				return encodeURIComponent(xor.encode(JSON.stringify(value)));
			},
			decode(value) {
				return JSON.parse(xor.decode(decodeURIComponent(value)));
			},
			default() {
				return default_settings;
			},
			maxAge: 60 * 60 * 24 * 365
		});

		cookie.value = { ...settings.value };
		settings.value = { ...cookie.value };
	}

	return { settings, update_setting, update_engine, save_cookie, delete_engine, add_engine, default_settings };
}