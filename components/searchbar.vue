<script lang="ts">
import { PropType } from 'vue';
import validator from 'validator';

export interface SearchEngine {
	id: number;
	name: string;
	url: string;
	logo_name: string;
	default?: boolean;
}

export default {
	props: {
		engines: {
			type: Array as PropType<Array<SearchEngine>>,
			default: () => [
				{
					id: 0,
					name: 'Google',
					url: 'https://www.google.com/search?q=%q',
					logo_name: 'arcticons:google-alt',
					default: true
				},
				{
					id: 1,
					name: 'Bing',
					url: 'https://www.bing.com/search?q=%q',
					logo_name: 'arcticons:microsoftbing-alt'
				},
				{
					id: 2,
					name: 'DuckDuckGo',
					url: 'https://duckduckgo.com/?q=%q',
					logo_name: 'arcticons:duckduckgo'
				}
			],
			validator: (value: SearchEngine[]) => value.every(
				engine =>
					typeof engine.id === 'number' &&
					typeof engine.name === 'string' &&
					typeof engine.url === 'string' &&
					typeof engine.logo_name === 'string'
			)
		},
		submit: {
			type: Function as PropType<(url:string) => void>,
			default: (url:string) => {
				// @ts-ignore
				register_uv();

				// @ts-ignore
				start_uv(url);
			}
		},
		small: {
			type: Boolean,
			default: false
		},
		width: {
			type: String,
			default: '96'
		}
	},
	data() {
		return {
			query: '',
			chosen_engine: this.engines.find(engine => engine.default == true) || this.engines[0]
		};
	},
	methods: {
		submit_url() {
			let url = this.query;

			let is_protocol_url = validator.isURL(this.query, {
				require_protocol: true
			});

			let is_url = validator.isURL(this.query, {
				require_protocol: false
			});

			if (is_url && !is_protocol_url) {
				url = 'https://' + this.query;
			}

			if (!is_url && !is_protocol_url) {
				let encoded_query = encodeURIComponent(this.query).replaceAll('%20', '+');
				url = this.chosen_engine.url.replace('%q', encoded_query);
			}

			this.submit(url);
		},
		change_engine(engine_id: number) {
			this.chosen_engine = this.engines.find(engine => engine.id == engine_id) || this.engines[0];
		},
		on_blur() {
			(this.$refs.searchbar_input as HTMLInputElement).classList.add('focus-reverse');
			setTimeout(() => {
				(this.$refs.searchbar_input as HTMLInputElement).classList.remove('focus-reverse');
			}, 200);
			(this.$refs.icon_box as HTMLElement).style.removeProperty('transform');
		},
		on_focus() {
			(this.$refs.icon_box as HTMLElement).style.transform = 'translateY(-0.15rem) ';
		},
		set_input_data(data: string) {
			this.query = data;
		}
	}
};
</script>

<template>
	<div
		v-if="!small"
		ref="searchbar"
		class="h-20 p-4"
	>
		<form @submit.prevent="submit_url">
			<input
				ref="searchbar_input"
				v-model="query"
				class="input input-accent input-md pl-12"
				:style="`outline:none; width:calc(${width}rem / 4)`"
				:placeholder="`Search with ${chosen_engine.name} or enter address`"
				@keyup.enter="submit_url"
				@blur="on_blur"
				@focus="on_focus"
			>
		</form>
		<div class="w-8" style="position:relative; bottom:2.45rem; left:0.5rem; z-index: 1;">
			<div ref="searchbar_dropdown" class="dropdown dropdown-hover">
				<label
					ref="icon_box"
					tabindex="0"
					:class="`btn btn-ghost btn-outline btn-sm p-2`"
				>
					<Icon
						:name="chosen_engine.logo_name"
						color="white"
						style="stroke-width: 0.2rem;"
					/>
				</label>
				<ul tabindex="0" class="dropdown-content menu shadow bg-base-200 rounded-box">
					<li v-for="engine in engines" :key="engine.id">
						<a class="pl-2 pr-2" @click="change_engine(engine.id)">
							<Icon
								:name="engine.logo_name"
								color="white"
								style="stroke-width: 0.2rem;"
								size="1.2rem"
							/>
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<div
		v-else
		ref="searchbar"
		class="h-8 searchbar w-full mx-2"
	>
		<form @submit.prevent="submit_url">
			<input
				ref="searchbar_input"
				v-model="query"
				class="input small input-bordered input-sm bg-transparent pl-8 w-full"
				:style="`outline:none;`"
				:placeholder="`Search with Google or enter address`"
				@keyup.enter="submit_url"
				@blur="on_blur"
				@focus="on_focus"
			>
		</form>
		<div
			ref="icon_box"
			class="relative w-4 h-6 icon-box"
			style="bottom:1.9rem;left:.5rem"
		>
			<Icon name="solar:magnifer-linear" class="icon" />
		</div>
	</div>
</template>

<style scoped>
@keyframes input_focus {
	0% {
		transform: scale(1);
		border-width: 1px;
		box-shadow: none;
	}

	100% {
		transform: translateY(-0.15rem);
		border-width: .15rem;
		box-shadow: 0 0 .25rem hsl(var(--a)/var(--tw-border-opacity));
	}
}

@keyframes input_focus_small {
	0% {
		transform: scale(1);
		border-width: 1px;
		border: 2px solid hsl(var(--nf));
	}

	100% {
		transform: translateY(-0.15rem);
		border-width: .15rem;
		border: 2px solid hsl(var(--n));
	}
}

.input:focus:not(.small) {
	animation: input_focus 0.2s ease-in-out forwards;
}

.input:focus.small {
	animation: input_focus_small 0.2s ease-in-out forwards;
}

.input.focus-reverse:not(.small) {
	animation: input_focus 0.2s ease-in-out reverse forwards;
}

.input.focus-reverse.small {
	animation: input_focus_small 0.2s ease-in-out reverse forwards;
}

.input.small {
	border: 2px solid hsl(var(--nf));
}

.searchbar:has(form > .input.small.focus) > div > .icon {
	margin-top: 1rem;
}

.icon-box {
	transition: all 0.2s ease-in-out;
}
</style>