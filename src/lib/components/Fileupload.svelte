<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	let value = '';
	let image: File;

	const change = (e: Event | { target: { value: String; files: FileList } } | string) => {
		dispatch('change', e);
	};

	const imageCheck = async (event: ClipboardEvent) => {
		event.preventDefault();
		if (event?.clipboardData?.files.length) {
			image = event.clipboardData.files[0];
			change({
				target: {
					value: 'copiedFromClipboard',
					files: event.clipboardData.files
				}
			});
		} else {
			let paste = event?.clipboardData?.getData('text');
			if (paste) {
				change(paste);
				value = paste;
			}
		}
	};
	let styleClass =
		' block text-base font-normal text-white bg-slate-600 bg-clip-padding  transition disabled:via-gray-50 ease-in-out focus:bg-gray-900 focus:outline-none';
</script>

<input
	on:change={change}
	bind:value={image}
	accept="image/png, image/jpeg"
	placeholder="Select file"
	class={styleClass + ' p-1.5 cursor-pointer overflow-hidden'}
	type="file"
	id="formFileDisabled"
/>
<input
	bind:value
	on:paste={imageCheck}
	placeholder="URL or Copypasted image"
	type="text"
	class={styleClass + ' py-2.3 px-2 xl:w-1/5  cursor-text form-input'}
/>
