<script setup lang="ts">
import { themeChange } from 'theme-change';
import themes from '~/utils/themes';

const { settings, delete_engine, update_engine, save_cookie, add_engine, update_setting, set_default } = useSettings();


useHead(useSetHead('Settings', 'Settings for the Atom web proxy'));

const delete_modal: any = ref(null);
const reset_modal: any = ref(null);

const kill_toast: any = ref(null);
const done_toast: any = ref(null);

let current_callback = () => {};

function confirm_delete(callback: () => void) {
	current_callback = callback;
	delete_modal.value.showModal();
}

function run_current_callback() {
	current_callback();
	exit_current_callback();
}

function exit_current_callback() {
	current_callback = () => {};
}

function confirm_reset() {
	current_callback = () => set_default();
	reset_modal.value.showModal();
}

function resetSW() {
	const { killSW } = useUltraviolet();
	const kill_toast_elem = kill_toast.value;
	const done_toast_elem = done_toast.value;

	kill_toast_elem.show();
	kill_toast_elem.stop(20);

	if (process.client) {
		killSW(window.navigator).then(() => {
			kill_toast_elem.resume();
		}).then(() => {
			setTimeout(() => {
				kill_toast_elem.hide();
				done_toast_elem.show();
			}, 1000);
		});
	}
}

onMounted(() => {
	themeChange(false);
});
</script>

<template>
	<div class="flex gap-8 items-center flex-row flex-wrap justify-around">
		<div class="card bg-base-200 shadow-xl" style="max-width: 74rem;">
			<div class="card-body">
				<h2 class="card-title w-full text-center flex-col">
					Search Engines
				</h2>

				<p class="text-sm w-full text-center">
					Name: The name of the search engine. <br>
					Icon Name: The identifier of the search engine's icon, from <a class="underline" href="https://icones.js.org">Icones</a><br>
					URL: The URL of the engine such that <code>%q</code> is replaced with the query<br>
					Note: The search engines can be non-unique. Identifiers are managed for you
				</p>

				<div class="flex flex-row gap-4 justify-around flex-wrap">
					<div
						v-for="engine in settings.engines"
						:key="engine.id"
						class="bg-base-300 mt-6 rounded-box flex flex-col p-4"
					>
						<div class="setting">
							<p class="text-xs">
								Name:
							</p>
							<input
								type="text"
								placeholder="Search engine name"
								class="input input-bordered input-xs bg-transparent ml-3 w-64"
								style="outline:none;"
								:value="engine.name"
								@change="(ev) => {
									const value = (ev.currentTarget as any).value as string;
									update_engine(engine.id, 'name', value);
								}"
							>
						</div>
						<div class="setting">
							<p class="text-xs">
								Icon Name:
							</p>
							<input
								type="text"
								placeholder="Search engine name"
								class="input input-bordered input-xs bg-transparent ml-3 w-64"
								style="outline:none;"
								:value="engine.logo_name"
								@change="(ev) => {
									const value = (ev.currentTarget as any).value as string;
									update_engine(engine.id, 'logo_name', value);
								}"
							>
						</div>
						<div class="setting">
							<p class="text-xs">
								URL:
							</p>
							<input
								type="text"
								placeholder="Search engine name"
								class="input input-bordered input-xs bg-transparent ml-3 w-64"
								style="outline:none;"
								:value="engine.url"
								@change="(ev) => {
									const value = (ev.currentTarget as any).value as string;
									update_engine(engine.id, 'url', value);
								}"
							>
						</div>
						<button
							class="btn btn-sm btn-outline btn-error w-full normal-case mt-2"
							:disabled="!engine.can_delete"
							@click="confirm_delete(() => delete_engine(engine.id))"
						>
							Delete
						</button>
					</div>
				</div>

				<div class="w-full flex flex-col items-center">
					<button class="btn btn-sm btn-outline btn-success w-64 normal-case mt-2" @click="add_engine">
						Add
					</button>
				</div>

				<div class="card-actions justify-end mt-6">
					<button class="btn btn-md btn-outline btn-accent w-full" @click="save_cookie">
						Save
					</button>
				</div>
			</div>
		</div>

		<div class="card bg-base-200 shadow-xl" style="max-width: 74rem;">
			<div class="card-body">
				<h2 class="card-title w-full text-center flex-col">
					Tab Masking
				</h2>

				<p class="text-sm w-full text-center">
					Set the icon and title of the website <br>
					<code>%p</code> will get replaced with the page name <br>
					You <b>cannot</b> use an Icones identifier for the icon URL <br>
					You <b>must</b> save and reload for changes to take effect
				</p>

				<div class="bg-base-300 mt-6 rounded-box flex flex-col p-4">
					<div class="setting">
						<p class="text-xs">
							Title:
						</p>
						<input
							type="text"
							placeholder="Tab Title"
							class="input input-bordered input-xs bg-transparent ml-3 w-64"
							style="outline:none;"
							:value="settings.tab_mask.title"
							@change="(ev) => {
								const value = (ev.currentTarget as any).value as string;
								update_setting('tab_mask', { title: value, icon: settings.tab_mask.icon, description: settings.tab_mask.description });
							}"
						>
					</div>
					<div class="setting last">
						<p class="text-xs">
							Icon URL:
						</p>
						<input
							type="text"
							placeholder="Tab Icon URL"
							class="input input-bordered input-xs bg-transparent ml-3 w-64"
							style="outline:none;"
							:value="settings.tab_mask.icon"
							@change="(ev) => {
								const value = (ev.currentTarget as any).value as string;
								update_setting('tab_mask', { title: settings.tab_mask.title, icon: value, description: settings.tab_mask.description });
							}"
						>
					</div>
				</div>

				<div class="card-actions justify-end mt-6">
					<button class="btn btn-md btn-outline btn-accent w-full" @click="save_cookie">
						Save
					</button>
				</div>
			</div>
		</div>

		<div class="card bg-base-200 shadow-xl" style="max-width: 74rem;">
			<div class="card-body">
				<h2 class="card-title w-full text-center flex-col">
					Kill Service Worker
				</h2>

				<p class="text-sm w-full text-center">
					If you are having problems with Ultraviolet, do this. <br>
					This may remove all Ultraviolet site data. <br>
					To restart the service worker, go to the homepage
				</p>

				<div class="card-actions justify-end mt-6">
					<button class="btn btn-md btn-outline btn-error w-full" @click="resetSW">
						Reset
					</button>
				</div>
			</div>
		</div>

		<div class="card bg-base-200 shadow-xl" style="max-width: 74rem;">
			<div class="card-body">
				<h2 class="card-title w-full text-center flex-col">
					Theme
				</h2>

				<p class="text-sm w-full text-center">
					Change the theme
				</p>

				<div class="card-actions justify-end mt-6">
					<select class="select select-bordered w-full" data-choose-theme>
						<option selected value="">
							Default
						</option>
						<option
							v-for="theme in themes"
							:key="theme"
							:value="theme"
							class="capitalize"
						>
							{{ theme }}
						</option>
					</select>
				</div>
			</div>
		</div>

		<dialog
			ref="delete_modal"
			class="modal"
		>
			<form method="dialog" class="modal-box">
				<h3 class="text-lg">
					Confirm Deletion
				</h3>
				<p>Are you sure you want to delete this? Changes are irreversible!</p>

				<div class="modal-action">
					<button class="btn w-24 h-6 btn-error btn-outline" @click="run_current_callback">
						Delete
					</button>

					<button class="btn w-24" @click="exit_current_callback">
						Cancel
					</button>
				</div>
			</form>
		</dialog>

		<dialog
			ref="reset_modal"
			class="modal"
		>
			<form method="dialog" class="modal-box">
				<h3 class="text-lg">
					Confirm Reset
				</h3>
				<p>Are you sure you want to reset to default? Changes are irreversible!</p>

				<div class="modal-action">
					<button class="btn h-6 btn-error btn-outline" @click="run_current_callback">
						Yes, please reset!
					</button>

					<button class="btn w-24" @click="exit_current_callback">
						Cancel
					</button>
				</div>
			</form>
		</dialog>

		<Toast
			ref="kill_toast"
			icon="solar:info-circle-linear"
			:timeout_ms="1000"
			message="Killing Service Worker..."
			hidden
		/>

		<Toast
			ref="done_toast"
			icon="solar:check-circle-linear"
			:timeout_ms="1000"
			message="Service Worker Killed"
			hidden
		/>

		<div class="w-full flex flex-col items-center mb-4">
			<div class="text-sm rounded-box bg-base-200 w-fit">
				<div class="btn btn-xs btn-rounded btn-error normal-case" @click="confirm_reset">
					Reset Settings to Default
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.input {
	transition: all 0.2s ease-in-out;

	&:focus {
		transform: scale(1.01) translateY(-0.15rem);
		border-width: 2px;
	}
}

.setting {
	display: flex;
	flex-direction: row;
	align-items: center;
	&:not(.last) {
		margin-bottom: .5rem;
	}
}

* {
	transition: all 0.2s ease-in-out;
}
</style>