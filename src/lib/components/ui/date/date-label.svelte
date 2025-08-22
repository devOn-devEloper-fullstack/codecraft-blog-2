<script lang="ts">
	import { cn } from '$lib/utils';

	let { class: className } = $props();

	let date = <String>$state();
	date = new Date().toDateString();

	$effect(() => {
		const id = setInterval(() => {
			date = new Date().toDateString();
		}, 1000 * 60);

		return () => {
			clearInterval(id);
		};
	});
</script>

<span class={cn('text-xl text-gray-400', className)}>{date}</span>
