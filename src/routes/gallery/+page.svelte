<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<h1>Gallery</h1>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;">
	{#each data.items as item}
		<figure style="margin:0">
			<img
				src={item.url}
				alt={item.key}
				style="width:100%;height:auto;object-fit:cover;border-radius:8px;"
			/>
			<figcaption style="font-size:12px;color:#666;word-break:break-all;padding-top:4px;">
				{item.key}
			</figcaption>
		</figure>
	{/each}
</div>
