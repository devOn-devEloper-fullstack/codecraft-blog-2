<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	let {
		title = $bindable(),
		slug = $bindable(),
		...restProps
	}: { title: string; slug: string } = $props();

	let slugValue = $derived.by(() => {
		return title
			.toLowerCase()
			.replace(/[^\w\s]+/g, '')
			.trim()
			.replace(/\s+/g, '-')
			.slice(0, 96);
	});

	$effect(() => {
		slug = slugValue;
	});

	// $effect(() => {
	// 	slug = title
	// 		.toLowerCase()
	// 		.replace(/[^\w\s]+/g, '') //removes special characters
	// 		.trim() // trims whitespace on string exterior
	// 		.replace(/\s+/g, '-') // converts whitespace to hypens
	// 		.slice(0, 96); // restricts the output to 96 characters
	// });
</script>

<Input bind:value={slugValue} {...restProps} placeholder="Enter a unique slug for your post" />
