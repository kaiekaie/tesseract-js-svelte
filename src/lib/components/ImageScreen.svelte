<script lang="ts">
	import { progress } from '$/store';
	import Progress from '$lib/components/Progress.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	export let imageUrl: string | null = null;

	export let words: Tesseract.Word[] = [];
	export let imageElement: HTMLImageElement | null = null;
	let imageSize: { width: number; height: number } = { width: 0, height: 0 };
	let clientSize: { width: number; height: number } = { width: 0, height: 0 };

	let html: HTMLElement | null = null;

	let width = 0;
	let height = 0;
	let lastMouseX = 0;
	let lastMouseY = 0;
	let wi = 0;
	let hi = 0;
	let mouseXNow = 0;
	let mouseYNow = 0;
	let rect: SVGRectElement | null = null;

	$: {
		if (imageElement) {
			width = 0;
			height = 0;
			imageElement.onload = () => {
				progress.set({ progress: 0.9, status: 'Finished', finished: false });
				imageSize = {
					width: imageElement?.naturalWidth || 0,
					height: imageElement?.naturalHeight || 0
				};
				progress.set({ progress: 1, status: 'Finished', finished: true });
			};
		}
		console.log(words);
	}
	const dispatch = createEventDispatcher();

	onMount(() => {
		window.addEventListener('resize', () => {
			clientSize = {
				width: html?.clientWidth || 0,
				height: html?.clientHeight || 0
			};
		});
	});

	let mousedown = false;

	const mouseDown = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		clientSize = {
			width: html?.clientWidth || 0,
			height: html?.clientHeight || 0
		};
		wi = imageSize.width / clientSize.width;
		hi = imageSize.height / clientSize.height;

		width = 0;
		height = 0;
		lastMouseX = 0;
		lastMouseY = 0;

		lastMouseX = e.offsetX * wi;
		lastMouseY = e.offsetY * hi;

		mousedown = true;
	};

	const mouseUp = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (mousedown) {
			let newwidth = width <= 0 ? width * -1 : width;
			let newheight = height <= 0 ? height * -1 : height;

			lastMouseX = width <= 0 ? lastMouseX - newwidth : lastMouseX;
			lastMouseY = height <= 0 ? lastMouseY - newheight : lastMouseY;

			if (newwidth > 1 && newheight > 1) {
				dispatch('mouseup', {
					left: lastMouseX,
					top: lastMouseY,
					width: newwidth,
					height: newheight
				});

				width = newwidth;
				height = newheight;
			}
		}
		mousedown = false;
	};

	const mouseMove = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		clientSize = {
			width: html?.clientWidth || 0,
			height: html?.clientHeight || 0
		};
		wi = imageSize.width / clientSize.width;
		hi = imageSize.height / clientSize.height;
		if (mousedown) {
			let mouseX = e.offsetX * wi;
			let mouseY = e.offsetY * hi;

			width = mouseX - lastMouseX;
			height = mouseY - lastMouseY;
		}

		mouseXNow = e.offsetX * wi;
		mouseYNow = e.offsetY * hi;
	};

	const svgClick = (e: Event) => {
		let target = e.target as SVGTextElement;
		if (target) {
			navigator.clipboard.writeText(target.textContent || '');
		}
	};
</script>

<div class="flex flex-row justify-evenly w-full text-black bg-slate-500/75  px-2  ">
	<p class="text-lg user-select-none">
		x: {mouseXNow}
	</p>
	<p class="text-lg user-select-none">
		y: {mouseYNow}
	</p>
	<p class="text-lg user-select-none">
		width: {width}
	</p>
	<p class="text-lg user-select-none">
		height: {height}
	</p>
</div>
<div bind:this={html} class="w-full relative overflow-auto bg-white">
	{#if $progress.status && !$progress.finished}
		<div class="absolute w-full h-full top-0 bg-black/75 cursor-wait ">
			<div class="top-1/2 absolute w-full"><Progress /></div>
		</div>
	{/if}

	<svg
		viewBox={`0 0 ${imageSize?.width} ${imageSize?.height}`}
		on:pointerdown={mouseDown}
		on:pointerup={mouseUp}
		on:pointermove={mouseMove}
		on:mouseleave={mouseUp}
		class="cursor-crosshair "
		id="mySvg"
	>
		<image id="Image" href={imageUrl} />

		<g fill="white" id="Values" on:click={svgClick}>
			{#each words as word, index}
				<g id={word.text}>
					<rect
						x={word.bbox.x0 - 10}
						y={word.bbox.y0 - 10}
						bind:this={rect}
						width={word.bbox.x1 + 10 - word.bbox.x0 + 10}
						style="opacity: 0.8;"
						stroke="black"
						height={word.bbox.y1 + 10 - word.bbox.y0 + 10}
					/>

					<path
						id={`${index}-path`}
						stroke="black"
						fill="black"
						d={`M ${word.baseline.x0} ${word.baseline.y0} L ${word.baseline.x1} ${word.baseline.y0}`}
					/>

					<text class="cursor-pointer hover:fill-red-400 user-select-none " stroke="none" fill="red" font-size={word.font_size * wi * 10}>
						<textPath method="stretch" href={`#${index}-path`}> {word.text}</textPath></text
					>

					<!-- <line x1={word.baseline.x1} x2={word.baseline.x0} y1={word.baseline.y1} y2={word.baseline.y1} stroke={'black'} /> -->
				</g>
			{/each}
		</g>

		<polygon
			fill="none"
			stroke="black"
			stroke-dasharray="4"
			points={`${lastMouseX},${lastMouseY} ${lastMouseX + width},${lastMouseY} ${lastMouseX + width},${lastMouseY + height} ${lastMouseX},${
				lastMouseY + height
			}`}
		/>
	</svg>
</div>
