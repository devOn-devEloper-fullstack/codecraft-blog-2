<script lang="ts">
	import { Input } from '$lib/components/ui/input';

	let { tags = $bindable() } = $props();

	let inputValue = $state('');
	let tagValue = <String[]>$state([]);
	let disabled = $state(false);
	let errorMessage = $state();

	function addTag(input: string, addEnable: boolean) {
		if (!addEnable) {
			tagValue.push(input);
			inputValue = '';
		}
	}

	function removeTag(input: string) {
		tagValue = tagValue.filter((t) => t !== input);
	}

	function getInnerText(node: HTMLElement) {
		return node.innerText;
	}

	function getSibling(node: EventTarget | null) {
		//@ts-ignore
		return node?.previousElementSibling;
	}

	$effect(() => {
		if (tagValue.length > 4) {
			errorMessage =
				'You have added too many tags. Please review your tag selection and try again.';
			disabled = true;
		}

		if (tagValue.length <= 4) {
			errorMessage = undefined;
			disabled = false;
		}

		tags = tagValue;
	});
</script>

<div class="flex justify-start gap-4">
	{#each tagValue as tag}
		<div
			class="mb-2 flex items-center justify-between gap-2 rounded-full border border-gray-700 bg-primary px-2 py-1 text-white"
		>
			<span>{tag}</span>
			<button type="button" onclick={(e) => removeTag(getInnerText(getSibling(e.target)))}>✕</button
			>
		</div>
	{/each}
</div>

{#if errorMessage}
	<span class="text-destructive">{errorMessage}</span>
{/if}

<div class="flex items-center justify-between gap-8">
	<Input
		bind:value={inputValue}
		onkeydown={(e) => e.key === 'Enter' && addTag(inputValue, disabled)}
		placeholder="Start typing to add tags"
	/>
	<button
		type="button"
		onclick={() => addTag(inputValue, disabled)}
		class="mt-1 w-30 rounded-md bg-primary px-2 py-2 text-white"
		{disabled}>Add Tag</button
	>
</div>
