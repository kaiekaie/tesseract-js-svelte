<script context="module" type="ts">
	export function load({ error, status }: any) {
		return {
			props: {
				title: `${status}: ${error.message}`
			}
		};
	}
</script>

<script type="ts">
	export let title: string;
</script>

<h1>{title}</h1>
