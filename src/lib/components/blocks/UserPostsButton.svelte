<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	let {
		href,
		content,
		class: className
	}: { href: string; content: string; class: string } = $props();
</script>

<Button {href} class={className}>{content}</Button>
