<script setup lang="ts">
import { v4 as randomUUID } from 'uuid';

// page setup
definePageMeta({
	layout: false,
	title: 'Browser | Atom',
	description: 'Atom Browser'
});

let first_tab_set = false;

const default_url = 'https://google.com';
const { obfuscate, url } = useData(useRoute(), {
	obfuscate: false,
	url: default_url
});


// working with tabs
interface Tab {
	id: string;
	init_url: string;
	title: string;
	image: string;
	is_first?: boolean;
}

const tabs = useState<Tab[]>('tabs', () => {
	return [
		{
			id: randomUUID(),
			init_url: url,
			title: 'Example',
			image: '/atom.svg',
			is_first: true
		}
	];
});

const active_tab = useState('active_tab', () => {
	return tabs.value[0].id;
});

const update_title = (id: string, title: string) => {
	const tab = tabs.value.find(tab => tab.id === id);
	if (tab) {
		tab.title = title;
	}
};

const update_image = (id: string, image: string) => {
	const tab = tabs.value.find(tab => tab.id === id);
	if (tab) {
		tab.image = image;
	}
};

const add_tab = (): string => {
	const id = randomUUID();

	set_active_tab(id);

	tabs.value.push({
		id,
		init_url: default_url,
		title: '',
		image: ''
	});

	return id;
};

const remove_tab = (id:string) => {
	const index = tabs.value.findIndex(tab => tab.id === id);
	if (index !== -1) {
		tabs.value.splice(index, 1);
	}

	if (tabs.value.length == 0) {
		add_tab();
	} else if (id == active_tab.value) {
		set_active_tab(tabs.value.filter(n => n.id != id)[0].id);
	}
};

const set_active_tab = (id: string) => {
	active_tab.value = id;
};

const iframe_onload = (tab_id: string, iframe: HTMLIFrameElement) => {
	const title = iframe.contentDocument?.title;
	const actualurl = new URL(xor.decode(iframe.contentWindow?.location.href.split('/').at(-1) || ''));
	
	const image_url = (iframe.contentDocument?.querySelector('link[rel="icon"]') as any)?.href ??
		(iframe.contentDocument?.querySelector('link[rel="shortcut icon"]') as any)?.href ??
		(iframe.contentDocument?.querySelector('meta[property="og:image"]') as any)?.content ??
		actualurl.origin + '/favicon.ico' ??
		actualurl.origin + '/favicon.png';

	update_title(tab_id, title ?? '');
	update_image(tab_id, image_url ?? '');
};
</script>

<template>
	<div>
		<div class="w-screen h-12 bg-base-200 flex p-2">
			<div
				v-for="tab in tabs"
				:key="tab.id"
				:class="`browser-tab h-8 rounded-md flex items-center mr-2 cursor-pointer ${tab.id == active_tab ? 'bg-neutral hover:bg-neutral-focus' : 'bg-base-200 hover:bg-base-300'}`"
				:style="`width: calc(calc(100% - ${tabs.length}rem) / ${tabs.length}); max-width: 16rem;`"
				@click="set_active_tab(tab.id)"
			>
				<img
					:src="tab.image"
					class="w-4 h-4 ml-2"
					type="image/x-icon"
				>
				<p class="ml-2 text-xs text-accent-content whitespace-nowrap truncate w-48">
					{{ tab.title }}
				</p>

				<button
					class="btn btn-sm btn-ghost btn-square ml-auto"
					style="z-index: 3;"
					@click.stop="remove_tab(tab.id)"
					@mouseover.stop="active_tab=active_tab"
				>
					<Icon
						class="text-white"
						size="1.25rem"
						name="solar:close-circle-linear"
					/>
				</button>
			</div>

			<button class="btn btn-sm btn-ghost btn-square" @click.prevent="add_tab">
				<Icon
					class="text-white"
					size="1.5rem"
					name="solar:add-circle-linear"
				/>
			</button>
		</div>

		
		<div
			v-for="tab in tabs"
			:key="tab.id"
			:class="`w-screen ${tab.id == active_tab ? 'block' : 'hidden'}`"
			style="height:calc(100vh - 3rem);"
		>
			<ProxyUI
				no_settings
				:rounded="false"
				:autohide="false"
				:start_url="tab.init_url"
				:obfuscate="obfuscate"
				:class="`w-64 h-64`"
				:iframe_onload="(iframe) => iframe_onload(tab.id, iframe)"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
.browser-tab {
	transition: all 0.2s ease-in-out;

	&:active:focus,
	&:active:hover:not(:hover .btn:hover) {
		transition: all 0.15s ease-in-out;
		transform: scale(0.95);
	}
}

* {
	transition: all 0.2s ease-in-out;
}
</style>