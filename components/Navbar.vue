<script setup>
const { getSession, status: account_status, signIn, signOut } = useAuth();

const { data: session, error, status: session_status, refresh } = useAsyncData(async () => await getSession());
</script>

<template>
	<div class="m-4 mb-8">
		<div class="navbar bg-base-200 shadow-xl rounded-box">
			<div class="navbar-start">
				<div class="drawer">
					<input
						id="nav-drawer"
						class="drawer-toggle"
						type="checkbox"
					>
					<div class="drawer-content">
						<label
							for="nav-drawer"
							class="btn btn-ghost btn-square swap swap-rotate"
							aria-label="pages"
						>
							<Icon
								class="swap-off"
								name="solar:list-linear"
								color="white"
								size="1.5rem"
							/>
							<Icon
								class="swap-on"
								name="solar:close-circle-linear"
								color="white"
								size="1.5rem"
							/>
						</label>
					</div>
					<div class="drawer-side" style="z-index: 2;">
						<label for="nav-drawer" class="drawer-overlay" />
						<ul
							tabindex="0"
							class="menu p-4 w-80 bg-base-200 text-base-content rounded-box mt-4"
							style="height: calc(100% - 2rem);"
						>
							<li>
								<NuxtLink to="/browser">
									Browser
								</NuxtLink>
							</li>
							<li>
								<NuxtLink to="/about">
									About
								</NuxtLink>
							</li>
							<li>
								<NuxtLink to="/settings">
									Settings
								</NuxtLink>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div class="navbar-center">
				<NuxtLink class="btn btn-ghost" to="/">
					<img
						src="/atom.svg"
						class="w-10 h-10"
						alt="Atom Logo"
					>
					<p class="normal-case text-2xl mb-1">
						Atom
					</p>
				</NuxtLink>
			</div>

			<div class="navbar-end" />
			<!-- <div v-if="account_status == 'authenticated'" class="navbar-end">
				<div v-if="session_status == 'success'">
					<div class="dropdown dropdown-end">
						<label tabindex="0" class="btn btn-ghost btn-circle">
							<div class="avatar">
								<div class="relative w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
									<img :src="session.user.image">
								</div>
							</div>
						</label>

						<ul
							tabindex="0"
							class="dropdown-content menu menu-md shadow bg-base-300 rounded-box mt-2"
							style="width: 20rem; z-index: 2;"
						>
							<li class="disabled">
								<a>
									Profile <div class="badge badge-outline">Coming soon!</div>
								</a>
							</li>
							<li class="disabled">
								<a>
									Account Settings <div class="badge badge-outline">Coming soon!</div>
								</a>
							</li>
							<div class="divider m-2" />
							<li>
								<a class="btn-error" @click="signOut">Sign Out</a>
							</li>
						</ul>
					</div>
				</div>
				<button
					v-else-if="session_status == 'error'"
					class="btn btn-error btn-md rounded-btn normal-case"
					@click="refresh"
				>
					Error fetching data, refresh?
				</button>
				<span v-else class="loading loading-spinner loading-md text-accent mr-4" />
			</div>

			<div v-else-if="account_status == 'loading'" class="navbar-end">
				<span class="loading loading-spinner loading-md text-accent mr-4" />
			</div>

			<div v-else class="navbar-end">
				<button class="btn btn-primary btn-md rounded-btn" @click="signIn('discord')">
					Sign In
				</button>
			</div>
		</div> -->
		</div>
	</div>
</template>

<style scoped>
.drawer-toggle:checked~.drawer-side>.menu {
	margin-left: 1rem;
}
</style>