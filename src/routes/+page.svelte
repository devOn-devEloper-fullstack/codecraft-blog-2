<script lang="ts">
	let alphabet = $state(['ABC', 'DEF', 'GHI']);
	let value = $state('');

	function addTag(input: string) {
		alphabet.push(input);
		value = '';
	}

	function removeTag(input: string) {
		alphabet = alphabet.filter((t) => t !== input);
	}

	function getInnerText(node: HTMLElement) {
		return node.innerText;
	}

	function getSibling(node: EventTarget | null) {
		//@ts-ignore
		return node.previousElementSibling;
	}
</script>

<div class="my-5 flex justify-start gap-6">
	{#each alphabet as alpha}
		<div>
			<span>{alpha}</span>
			<button
				type="button"
				onclick={(e) => removeTag(getInnerText(getSibling(e.target)))}
				class="rounded-full border border-gray-600 px-4">Remove Me</button
			>
		</div>
	{/each}
</div>
<input
	bind:value
	class="border border-black"
	onkeydown={(e) => e.key === 'Enter' && addTag(value)}
/>

<button type="button" onclick={() => addTag(value)}>Add Text</button>
