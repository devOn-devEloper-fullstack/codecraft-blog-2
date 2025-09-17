<script lang="ts">
	let { content }: { content: string } = $props();
</script>

<article
	class="prose-container mx-auto min-h-[60vh] max-w-[1000px] justify-center rounded-2xl px-8 py-4 text-start text-xl shadow-lg ring-1 ring-gray-400"
>
	{@html content}
</article>
