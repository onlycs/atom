<script setup lang="ts">
import { v4 as randomUUID } from 'uuid';

// page setup
definePageMeta({
	layout: false
});

useHead(useSetHead('Browser', 'A browser for the Atom web proxy'));
</script>

<template>
	<div>
		<Browser />
	</div>
</template>