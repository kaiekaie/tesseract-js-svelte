<script lang="ts">
	import '../app.postcss';
	import json from '$/lang/en.json';
	import { appState, pageColor } from '$/store';
	import { onMount } from 'svelte';
	let main: HTMLElement | null = null;

	onMount(() => {
		document.getElementById('splash')?.remove();
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			$appState.isMobile = true;
		}
	});

	// $: {
	// 	if (typeof document !== 'undefined' && $pageColor.r !== 0 && $pageColor.g !== 0 && $pageColor.b !== 0) {
	// 		document.body.style.backgroundColor = `rgba(${$pageColor.r},${$pageColor.g},${$pageColor.b},${$pageColor.a})`;
	// 	}
	// }
</script>

<svelte:head>
	<title>
		{json.title}
	</title>
</svelte:head>

<div bind:this={main}>
	<slot />
</div>
