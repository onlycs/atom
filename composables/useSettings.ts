import { SearchEngine } from 'components/Searchbar.vue';
import { v4 as randomUUID } from 'uuid';

export interface Settings {
	engines: SearchEngine[],
}

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
				return {
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
					]
				};
			},
			maxAge: 60 * 60 * 24 * 365
		});

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

	function delete_engine(id:string) {
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
				return {
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
					]
				};
			},
			maxAge: 60 * 60 * 24 * 365
		});

		cookie.value = { ...settings.value };
		settings.value = { ...cookie.value };
	}

	return { settings, update_setting, update_engine, save_cookie, delete_engine, add_engine };
}