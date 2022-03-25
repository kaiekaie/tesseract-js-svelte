<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { linear } from 'svelte/easing';
	const area = tweened(0, {
		easing: linear,
		duration: 1000
	});
	import { progress } from '$/store';
	let progressMap = new Map();
	let arr: any[] = [];

	$: {
		area.set($progress?.progress * 100);
		progressMap.set($progress?.status, $progress.progress * 100);
		arr = [...progressMap];
	}
</script>

<div class="relative w-full bg-gray-900/50">
	<div class="text-sm text-white text-center w-full  capitalize p-1 z-10 relative">
		{#if $progress?.status}
			{$progress?.status}:
		{/if}
		{Math.round($area)}%
	</div>
	<div
		class="bg-gradient-to-l from-green-400/75 to-blue-500/75 rounded-sm h-7 transition-all top-0 z-0 absolute"
		style:width={`${Math.round($area)}%`}
	/>
	{#each arr as [key, value]}
		<div class="text-white capitalize p-2">{key}: {value === 100 ? 'Done' : 'In progress'}</div>
	{/each}
</div>
