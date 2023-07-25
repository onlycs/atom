<script setup lang="ts">
import { PropType } from 'vue';
import validator from 'validator';


const props = defineProps({
	submit: {
		type: Function as PropType<(url: string) => void>,
		required: true
	},
	small: {
		type: Boolean,
		default: false
	},
	width: {
		type: String,
		default: '96'
	}
});

const { settings } = useSettings();
const engines = [...settings.value.engines];

let chosen_engine = useState('chosen_engine', () => engines.find(e => e.default) || engines[0]);
let input_data = useState('input_data', () => '');

const submit_url = () => {
	let url = input_data.value;

	let is_protocol_url = validator.isURL(url, {
		require_protocol: true
	});

	let is_url = validator.isURL(url, {
		require_protocol: false
	});

	if (is_url && !is_protocol_url) {
		url = 'https://' + url;
	}

	if (!is_url && !is_protocol_url) {
		let encoded_query = encodeURIComponent(url).replaceAll('%20', '+');
		url = chosen_engine.value.url.replace('%q', encoded_query);
	}

	props.submit(url);
};

const change_engine = (id: string) => {
	chosen_engine.value = engines.find(e => e.id == id) || engines[0];
};

defineExpose({
	set_input_data(v: string) {
		input_data.value = v;
	}
});
</script>

<template>
	<div
		v-if="!small"
		class="h-20 p-4"
	>
		<form @submit.prevent="submit_url">
			<input
				v-model="input_data"
				class="input input-accent input-md pl-12"
				:style="`outline:none; width:calc(${width}rem / 4)`"
				:placeholder="`Search with ${chosen_engine.name} or enter address`"
				@keyup.enter="submit_url"
			>
		</form>
		<div class="w-8" style="position:relative; bottom:2.45rem; left:0.5rem; z-index: 1;">
			<div class="dropdown dropdown-hover">
				<label
					tabindex="0"
					aria-label="Change search engine"
					class="btn btn-ghost btn-outline btn-sm p-2"
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
				v-model="input_data"
				class="input small input-bordered input-sm bg-transparent pl-8 w-full"
				style="outline:none;"
				:placeholder="`Search with Google or enter address`"
				@keyup.enter="submit_url"
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

<style scoped lang="scss">
/* @keyframes input_focus {
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
} */

.input {
	transition: all 0.2s ease-in-out;

	&:not(.small):focus {
		border-width: .2rem;
		transform: scale(1.01);
	}

	&.small:focus {
		transform: translateY(-0.15rem);
		border: 2px solid hsl(var(--n));
	}
}
</style>