<script lang="ts">
	let { tags }: { tags: string[] } = $props();
</script>

<div class="flex flex-row gap-3">
	<span class="text-lg font-semibold text-gray-400">TAGS:</span>

	{#each tags as tag}
		<span
			class="items-center justify-center rounded-2xl bg-[var(--primary)] px-3 text-center text-lg text-white"
			>{tag}</span
		>
	{/each}

	<!-- TODO: ADD ANCHOR TAGS TO LINK TO SEARCH RESULTS FOR SELECTED TAG -->
</div>
