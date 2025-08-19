<script lang="ts">
	let { title = $bindable(), slug = $bindable() }: { title: string; slug: string } = $props();

	$effect(() => {
		if (!slug && title) {
			slug = title
				.toLowerCase()
				.replace(/[^a-z0-9\s-]/g, '')
				.trim()
				.replace(/\s+/g, '-')
				.slice(0, 96);
		}
	});
</script>

<label>
	<span>Slug</span>
	<input name="slug" bind:value={slug} required />
</label>
