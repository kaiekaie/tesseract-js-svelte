<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	const area = tweened([0], { easing: cubicInOut, duration: 1000 });
	import { progress } from '$app/store';

	$: {
		area.set([$progress?.progress * 100]);
	}
</script>

<div class="relative w-full bg-gray-900/50">
	<div class="text-sm text-white text-center w-full  capitalize p-1 z-10 relative">
		{#if $progress?.status}
			{$progress?.status}:
		{/if}
		{Math.floor($area[0])}%
	</div>
	<div
		class="bg-gradient-to-l from-green-400/75 to-blue-500/75 rounded-sm h-7 transition-all top-0 z-0 absolute"
		style:width={`${$area[0]}%`}
	/>
</div>
