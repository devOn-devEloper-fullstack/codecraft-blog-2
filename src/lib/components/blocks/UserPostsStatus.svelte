<script lang="ts">
	let { status }: { status: boolean } = $props();
</script>

{#if status === true}
	<span class="rounded-md bg-[#0F5132] px-4 py-2 text-center text-sm text-white">Published</span>
{:else}
	<span class="rounded-md bg-[#8B0000] px-4 py-2 text-center text-sm text-white"
		>Awaiting Approval</span
	>
{/if}
