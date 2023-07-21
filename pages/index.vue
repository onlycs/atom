<script lang="ts">
import { GlobalComponents } from 'nuxt/dist/app/compat/capi';
import { xor } from '~/utils/xor';

export default {
	data() {
		return {
			proxyui: false,
			browser: false,
			obfuscate: false,
			settings_menu: this.$refs.settings_menu as GlobalComponents['SettingsMenu']
		};
	},
	methods: {
		submit_url(url: string) {
			let push_url = '/proxy';

			if (this.proxyui) {
				push_url = '/proxy';
			} else if (this.browser) {
				push_url = '/browser';
			} else {
				if (process.client) {
					window.location.href = `/ultraviolet/uv.start.html?url=${url}`;
				}
				
				return;
			}
			
			this.$router.push(addData(push_url, {
				url,
				obfuscate: this.obfuscate
			}));
		}
	}
};
</script>

<template>
	<div class="flex justify-center mt-24">
		<div class="flex flex-row items-center card bg-base-200 h-24 p-2" style="width: 40rem;">
			<div class="absolute top-6 left-6">
				<SettingsMenu
					ref="settings_menu"
					size="md"
					:settings="[
						{
							id: 'cyrillic',
							name: 'Cyrillic Obfuscation',
							type: 'boolean',
							value: obfuscate,
							disabled: !proxyui && !browser,
							onchange: (value: boolean) => {
								obfuscate = value;
							},
						},
						{
							id: 'proxyui',
							name: 'Proxy UI',
							type: 'boolean',
							value: proxyui,
							incompatible: ['browser'],
							onchange: (value: boolean) => {
								proxyui = value;
							},
						},
						{
							id: 'browser',
							name: 'Browser',
							type: 'boolean',
							value: browser,
							incompatible: ['proxyui'],
							onchange: (value: boolean) => {
								browser = value;
							},
						}
					]"
				/>
			</div>

			<div class="inline-flex w-full justify-center">
				<Searchbar ref="searchbar" :submit="submit_url" />
			</div>

			<div>
				<button
					class="btn btn-ghost btn-square absolute right-6 top-6"
					aria-label="Go"
					@click.prevent="(($refs.searchbar as any) as GlobalComponents['Searchbar']).submit_url()"
				>
					<Icon
						name="solar:round-alt-arrow-right-outline"
						color="white"
						size="1.5rem"
					/>
				</button>
			</div>
		</div>
	</div>
</template>