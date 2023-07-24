<script setup lang="ts">
const props = defineProps({
	icon: {
		type: String,
		required: false,
		default: ''
	},
	timeout_ms: {
		type: Number,
		required: true
	},
	message: {
		type: String,
		required: true
	}
});


const message = useState('message', () => props.message);
const icon = useState('icon', () => props.icon);

let tick = props.timeout_ms / 100;
const percent = useState('percent', () => 0);
const stopped = useState('stopped', () => false);
const hidden = useState('hidden', () => false);
const toast = ref(null);

function recursiveIncrement(on_finish?: () => void, until?: number, force?: boolean) {
	if (percent.value < (until || 100)) {
		if ((!stopped) || force) {
			setTimeout(() => recursiveIncrement(on_finish, until, force), tick);
		}
	} else {
		on_finish?.();
	}

	percent.value++;
}

function stop(at?: number) {
	stopped.value = true;
	
	if (at) {
		recursiveIncrement(() => {}, at, true);
	}
}

function resume() {
	stopped.value = false;
	recursiveIncrement(hide, 100, true);
}

function hide() {
	hidden.value = true;
	
	setTimeout(() => { percent.value = 0; }, 200);
}

function show() {
	hidden.value = false;
	stopped.value = false;
	percent.value = 0;

	recursiveIncrement(hide, 100, true);
}

function set_message(msg: string) {
	message.value = msg;
}

function set_icon(icn: string) {
	icon.value = icn;
}

onMounted(() => {
	recursiveIncrement(hide);
});

defineExpose({
	show,
	hide,
	stop,
	resume,
	set_message,
	set_icon
});
</script>

<template>
	<div
		ref="toast"
		:class="`toast ${hidden ? 'toast-hidden' : ''}`"
	>
		<div class="alert shadow-lg bg-base-300">
			<div class="flex flex-col w-full">
				<div class="flex items-center gap-2 -mb-1">
					<Icon
						v-if="icon != ''"
						:name="icon"
						class="h-5 w-5"
					/>

					<div class="ml-4">
						<p class="break-words text-sm w-48 whitespace-normal">
							{{ message }}
						</p>
					</div>
				</div>

				<progress
					style="height: .125rem;bottom:-1rem;width:calc(100% + 1.25rem)"
					class="progress progress-info relative"
					:value="percent"
					max="100"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.toast {
	transition: all 0.2s ease-in-out;

	&.toast-hidden {
		opacity: 0;
		transform: translateY(0.2rem);
	}
}
</style>