<script lang="ts">
	import { progress } from '$app/store';
</script>

<div class="relative w-full bg-gray-800">
	<div class="text-sm text-white text-center w-full  capitalize p-1 z-10 relative">
		{#if $progress?.status}
			{$progress?.status}:
		{/if}
		{$progress?.progress ? Math.round($progress?.progress * 100) : 0}%
	</div>
	<div
		class="bg-blue-600 rounded-sm h-7 transition-all top-0 z-0 absolute"
		style:width={`${$progress?.progress ? Math.round($progress?.progress * 100) : 0}%`}
	/>
</div>
