<script lang="ts">
	//@ts-nocheck
	import ControlFields from './ControlFields.svelte';
	import '@friendofsvelte/tipex/styles/index.css';
	import { Tipex } from '@friendofsvelte/tipex';
	let body = `<p>The initial html content.</p>`;
</script>

<!-- Shorthands to disable: !floating !focal -->
<Tipex
	{body}
	floating
	focal
	style="margin-top: 1rem; margin-bottom: 0;"
	class="h-[70vh] border border-neutral-200"
>
	{#snippet controlComponent(tipex)}
		<ControlFields {tipex} />
	{/snippet}
</Tipex>
