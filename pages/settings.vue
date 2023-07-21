<script setup lang="ts">
import { SearchEngine } from 'components/Searchbar.vue';
const { settings, delete_engine, update_engine, save_cookie, add_engine } = useSettings();
</script>

<template>
	<div class="justify-around flex">
		<div class="card bg-base-200 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">
					Search Engines
				</h2>

				<p class="text-sm">
					Name: The name of the search engine. <br>

					Icon Name: The identifier of the search engine's icon, from
					<a class="underline" href="https://icones.js.org">Icones</a><br>

					URL: The URL of the engine such that %q is replaced with the query<br>
				</p>

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
						@click="delete_engine(engine.id)"
					>
						Delete
					</button>
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
