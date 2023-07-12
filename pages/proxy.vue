<script setup lang="ts">
definePageMeta({
	layout: false
});

const { rounded, autohide, obfuscate, start_url } = useData(useRoute(), {
	rounded: true,
	autohide: true,
	obfuscate: false,
	start_url: 'https://google.com'
});
</script>

<template>
	<div class="w-screen h-screen">
		<ProxyUI
			:rounded="rounded"
			:autohide="autohide"
			:obfuscate="obfuscate"
			:start_url="start_url"
		/>
	</div>
</template>