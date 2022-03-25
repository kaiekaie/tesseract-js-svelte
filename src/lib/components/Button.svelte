<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let disabled: boolean = false;
	const dispatch = createEventDispatcher();
</script>

<button
	{disabled}
	on:click={() => dispatch('click')}
	class="bg-green-500 hover:bg-green-700 text-white min-w-[10rem] font-bold py-3 px-4 text-xs  disabled:bg-gray-400 disabled:text-gray-500"
	><slot /></button
>
