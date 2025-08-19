<script lang="ts">
	let { tags = $bindable() }: { tags: string[] } = $props();
	let input = $state('');
	function addTag() {
		const t = input.trim();
		if (t && !tags.includes(t)) tags = [...tags, t];
		input = '';
	}
	function removeTag(t: string) {
		tags = tags.filter((x) => x !== t);
	}
</script>

<div class="tags">
	<div class="chips">
		{#each tags as t (t)}
			<button type="button" class="chip" onclick={() => removeTag(t)}>{t} ✕</button>
		{/each}
	</div>
	<div class="row">
		<input
			placeholder="Add tag…"
			bind:value={input}
			onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
		/>
		<button type="button" onclick={addTag}>Add</button>
	</div>
</div>

<style>
	.chips {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.chip {
		background: #eef;
		border: 1px solid #cde;
		border-radius: 999px;
		padding: 0.25rem 0.5rem;
		cursor: pointer;
	}
	.row {
		display: flex;
		gap: 0.5rem;
	}
</style>
