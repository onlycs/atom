<script lang="ts">
import { GlobalComponents } from 'vue';
import { xor } from '~/utils/xor';
import { History } from '~/utils/history';

export default {
	props: {
		rounded: {
			type: Boolean,
			default: true
		},
		autohide: {
			type: Boolean,
			default: true
		},
		iframe_onload: {
			type: Function as PropType<(iframe: HTMLIFrameElement) => void>,
			default: (iframe: HTMLIFrameElement) => {}
		},
		start_url: {
			type: String,
			default: 'https://google.com'
		},
		obfuscate: {
			type: Boolean,
			default: false
		},
		no_settings: {
			type: Boolean,
			default: false
		}
	},
	setup() {
		if (process.client) {
			document.querySelector('.urlbox-container')?.classList.add('force-show');
			setTimeout(() => {
				document.querySelector('.force-show')?.classList.remove('force-show');
			}, 1000);
		}
	},
	data() {
		return {
			rounded_state: this.rounded,
			autohide_state: this.autohide,
			history: new History()
		};
	},
	methods: {
		set_url(url: string) {
			((this.$refs.iframe as HTMLIFrameElement).contentWindow as Window).location.href = `/ultraviolet/uv.start.html?url=${url}`;
		},
		iframe_load() {
			const iframe = this.$refs.iframe as HTMLIFrameElement;
			const searchbar = this.$refs.searchbar as GlobalComponents['Searchbar'];
			const iframe_window = iframe.contentWindow;
			const href = iframe.contentWindow?.location.href;

			if (href?.includes('/ultraviolet/service/')) {
				const real_url = xor.decode(iframe.contentWindow?.location.href.split('/').at(-1) || '');
				searchbar.set_input_data(real_url);
				
				this.history.set_next(real_url);
				this.iframe_onload(iframe);
				this.animation_end();
			}

			if (this.obfuscate) {
				recursiveReplace(iframe.contentDocument?.body);
			}

			iframe_window?.addEventListener('beforeunload', () => {
				this.animation_start();
			});
		},
		back() {
			this.history.go_back();
			this.set_url(this.history.current_url() ?? 'https://google.com');
		},
		forward() {
			this.history.go_forward();
			this.set_url(this.history.current_url() ?? 'https://google.com');
		},
		reload() {
			const iframe = this.$refs.iframe as HTMLIFrameElement;
			iframe.contentWindow?.location.reload();

			this.animation_start();
		},
		animation_start() {
			const reload_icon = (this.$refs.reload_btn as HTMLElement).children[0];

			if (!reload_icon.classList.contains('icon-rotate')) {
				reload_icon.classList.add('icon-rotate');
			}
		},
		animation_end() {
			const reload_icon = (this.$refs.reload_btn as HTMLElement).children[0];

			if (reload_icon.classList.contains('icon-rotate')) {
				reload_icon.addEventListener('animationiteration', () => {
					reload_icon.classList.remove('icon-rotate');
				});
			}
		}
	}
};
</script>

<template>
	<div class="w-full h-full navui-container flex flex-col">
		<div
			ref="urlbox_container"
			:class="`
				${autohide_state ? 'autohide absolute' : ''}
				${rounded_state ? 'rounded-box m-2' : 'w-full'}
				urlbox-container bg-base-200 p-2 select-none
				flex flex-row justify-between`"
			:style="`z-index: 3; width: ${rounded_state ? 'calc(100% - 1rem)' : ''};`"
		>
			<button
				class="btn btn-ghost btn-sm btn-square inline-block mx-1"
				:disabled="!history.can_go_back()"
				@click="back"
			>
				<Icon
					name="solar:round-double-alt-arrow-left-linear"
					size="1.1rem"
				/>
			</button>

			<button
				class="btn btn-ghost btn-sm btn-square inline-block mx-1"
				:disabled="!history.can_go_forward()"
				@click="forward"
			>
				<Icon
					name="solar:round-double-alt-arrow-right-linear"
					size="1.1rem"
				/>
			</button>

			<button
				id="reload_btn"
				ref="reload_btn"
				class="btn btn-ghost btn-sm btn-square inline-block mx-1"
				@click="reload"
			>
				<Icon
					name="solar:refresh-linear"
					size="1.1rem"
				/>
			</button>

			<button class="btn btn-ghost btn-sm btn-square inline-block mx-1" @click="useRouter().push('/')">
				<Icon
					name="solar:home-2-linear"
					size="1.1rem"
				/>
			</button>
			
			<Searchbar
				ref="searchbar"
				small
				class="inline-block"
				width="160"
				:submit="set_url"
			/>

			<SettingsMenu
				v-if="!no_settings"
				:settings="[
					{
						id: 'rounded_nav',
						name: 'Rounded navbar',
						type: 'boolean',
						value: rounded_state,
						onchange: (value) => {
							rounded_state = value;
						}
					},
					{
						id: 'autohide_nav',
						name: 'Autohide navbar',
						type: 'boolean',
						value: autohide_state,
						onchange: (value) => {
							autohide_state = value;
						}
					}
				]"
				size="sm"
				class="inline-block"
				dropdown_class="dropdown-bottom dropdown-end"
				content_class="bg-base-300 mt-4"
			/>
			<div v-else /> <!-- space-between -->
		</div>

		<iframe
			id="iframe"
			ref="iframe"
			:src="`/ultraviolet/uv.start.html?url=${start_url}`"
			:class="`w-full mt-${rounded_state ? '16' : '12'} no-unload-listener`"
			:style="`height: ${autohide_state ? '100%' : `calc(100% - ${rounded_state ? '4' : '3'}rem)`}`"
			@load="iframe_load"
		/>
	</div>
</template>

<style scoped>
.urlbox-container.autohide:hover {
	opacity: 1;
	transform: translateY(0);
}
.urlbox-container.autohide.force-show {
	opacity: 1;
	transform: translateY(0);
}

.urlbox-container.autohide:not(:hover, :focus-within, .force-show) {
	opacity: 0;
	transform: translateY(-1rem);
}

.urlbox-container.autohide {
	transition: all 0.2s ease-in-out;
}

.navui-container > * {
	transition: all 0.2s ease-in-out;
}

.icon-rotate {
	animation: rotate 0.6s ease-in-out infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  80% {
	transform: rotate(360deg);
  }
  100% {
	transform: rotate(360deg);
  }
}


/* Reload button pullback onpress */
#reload_btn:active:hover > svg {
	transform: scale(0.95) rotate(-20deg);
	transition: all 0.1s ease-in-out;
}
</style>