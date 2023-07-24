export function useUltraviolet() {
	return {
		killSW(navigator: Navigator) {
			navigator.serviceWorker.getRegistrations().then(registrations => {
				for (let registration of registrations) {
					registration.unregister();
				}
			});
		},
		load_bundle(window: Window, callback: (ev: Event) => void) {
			const { document } = window;

			if (!document.querySelector('script[src="/ultraviolet/uv.bundle.js"]')) {
				const script = document.createElement('script');
				script.src = '/ultraviolet/uv.bundle.js';
				document.head.appendChild(script);

				script.addEventListener('load', ev => {
					if (!document.querySelector('script[src="/ultraviolet/uv.config.js"]')) {
						const script = document.createElement('script');
						script.src = '/ultraviolet/uv.config.js';
						document.head.appendChild(script);

						script.addEventListener('load', callback);
					}
				});
			} else {
				callback(new Event('load'));
			}
		},
		is_registered(): Promise<boolean> {
			return new Promise((resolve, reject) => {
				navigator.serviceWorker.getRegistrations().then(registrations => {
					resolve(registrations.length > 0);
				});
			});
		},
		startSW() {
			return new Promise((resolve, reject) => {
				navigator.serviceWorker.getRegistrations().then(registrations => {
					if (registrations.length == 0) {
						register_uv().then(resolve).catch(reject);
					} else {
						resolve(undefined);
					}
				});
			});
		}
	};
}