<script lang="ts">
	import ImageScreen from '$lib/components/ImageScreen.svelte';
	import { onMount } from 'svelte';
	import Fileupload from '$lib/components/Fileupload.svelte';

	import Select from '$lib/components/Select.svelte';

	import { generateSVG, getImageColor, getImageText, uploadImage } from '$lib/utils';
	import { pageColor, progress } from '$/store';
	import Button from '$lib/components/Button.svelte';
	import { session } from '$app/stores';

	let imageUrl: string | any = null;
	let imageElement: HTMLImageElement | null = null;

	onMount(() => {
		progress.set({ progress: 0, status: 'Loading', finished: false });
		imageElement = new Image();
		console.log($session);
		if (localStorage.image) {
			imageUrl = localStorage.image;
		} else {
			imageUrl = '/template.png';
		}

		imageElement.src = imageUrl;
	});

	let words: Tesseract.Word[] = [];

	let lines: Tesseract.Line[] = [];
	let avgColors: { r: number; g: number; b: number; a: number } = { r: 0, g: 0, b: 0, a: 0 };

	let imageTextToData = async (imageData: string, rectangle?: Tesseract.Rectangle) => {
		const data = await getImageText(imageData, rectangle);
		if (data) {
			words = data.data.words.filter((word) => word.text.length > 1);

			lines = data.data.lines.filter((line) => line.text.length > 1);
			lines = lines.sort((a, b) => a.bbox.y0 - b.bbox.y0);
			words = words.sort((a, b) => a.bbox.y0 - b.bbox.y0);

			words = words.filter((e) => e.confidence > 10);
		}
	};

	let getImage = async (e: CustomEvent<Event>) => {
		words = [];
		let data = await uploadImage(e);
		console.log(data);

		if (data) {
			localStorage.setItem('image', data?.url);
			imageElement = data.element;

			imageUrl = data.url;
			let colors = getImageColor(imageElement);

			avgColors = colors.reduce<{ r: number; g: number; b: number; a: number }>(
				(acc, curr, i, arr) => {
					if (curr.r) {
						acc.r = Math.floor(curr.r + acc.r / arr.length);
						acc.g = Math.floor(curr.g + acc.g / arr.length);
						acc.b = Math.floor(curr.b + acc.b / arr.length);
						acc.a = Math.floor(curr.a + acc.a / arr.length);
					}

					return acc;
				},
				{ r: 0, g: 0, b: 0, a: 0 }
			);
		}
		pageColor.set(avgColors);
	};

	let options = [
		{ value: 'text', label: 'Text' },
		{ value: 'rectangle', label: 'Rectangle' },
		{ value: 'line', label: 'Line' },
		{ value: 'json', label: 'Json' }
	];
	let value = options[0].value;
</script>

<div class="flex lg:flex-row flex-col lg:items-start justify-start lg:space-x-1 lg:space-y-0 space-y-1  w-full  my-2">
	<Fileupload on:change={getImage} />
	<Button disabled={$progress.status !== null && !$progress.finished} on:click={() => imageTextToData(imageUrl)}>Get Text</Button>
</div>

{#if imageUrl && imageElement}
	<ImageScreen
		{words}
		{imageUrl}
		{imageElement}
		on:mouseup={(e) => {
			const rectangle = e.detail;
			imageTextToData(imageUrl, rectangle);
		}}
	/>
{/if}

<div class="w-full mt-2">
	<Select {options} bind:value />
	<textarea class="w-full h-32 p-2 text-white bg-gray-800 text-sm">{generateSVG(words, lines, value)}</textarea>
</div>
