<script lang="ts">
	import { Modal } from 'flowbite-svelte';
	import {
		getItems,
		getSelectionModalState,
		getTotal,
		imageSelectionEvent,
		toggleSelectionModalState,
		getPage,
		setPage,
		getLimit,
		prevPage,
		nextPage,
		setSelectionModalState
	} from './state.svelte';
	import { Pagination } from 'bits-ui';
	import CaretLeft from 'phosphor-svelte/lib/CaretLeft';
	import CaretRight from 'phosphor-svelte/lib/CaretRight';
</script>

<Modal
	bind:open={getSelectionModalState, setSelectionModalState}
	class="h-[80vh] w-[40vw] rounded-xl"
>
	<div class="flex flex-row justify-between">
		<div class="flex flex-col space-y-6">
			<h3 class="text-3xl font-bold text-black">Select an Image from the Gallery</h3>
			<div class="h-[45vh] w-fit">
				<div
					style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;"
				>
					{#each getItems() as item, i}
						<button type="button" onclick={imageSelectionEvent}>
							<figure style="margin:0">
								<img
									src={item.url}
									alt={item.key}
									style="width:100%;height:auto;object-fit:cover;border-radius:8px;"
								/>
								<figcaption style="font-size:12px;color:#666;word-break:break-all;padding-top:4px;">
									{#if item.caption}
										<strong>Image Caption:</strong>
										{item.caption}
									{:else}
										<strong>Image #{i}:</strong>
									{/if}
								</figcaption>
							</figure>
						</button>
					{/each}
				</div>
			</div>
			<Pagination.Root
				count={getTotal() ? getTotal() : 0}
				perPage={getLimit()}
				bind:page={getPage, setPage}
			>
				{#snippet children({ pages, range })}
					<div class="my-8 flex items-center justify-center">
						<Pagination.PrevButton
							class="mr-[25px] inline-flex size-10 items-center justify-center rounded-[9px] bg-transparent hover:bg-[var(--dark-10)] active:scale-[0.98] disabled:cursor-not-allowed disabled:text-muted-foreground hover:disabled:bg-transparent"
							onclick={prevPage}
						>
							<CaretLeft class="size-6" />
						</Pagination.PrevButton>
						<div class="flex items-center gap-2.5">
							{#each pages as pageData (pageData.key)}
								{#if pageData.type === 'ellipsis'}
									<div class="text-[15px] font-medium text-foreground-alt select-none">...</div>
								{:else}
									<Pagination.Page
										page={pageData}
										class="inline-flex size-10 items-center justify-center rounded-[9px] bg-transparent text-[15px] font-medium select-none hover:bg-dark-10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 hover:disabled:bg-transparent data-selected:bg-foreground data-selected:text-background"
										onclick={() => setPage(pageData.value)}
									>
										{pageData.value}
									</Pagination.Page>
								{/if}
							{/each}
						</div>
						<Pagination.NextButton
							class="ml-[29px] inline-flex size-10 items-center justify-center rounded-[9px] bg-transparent hover:bg-dark-10 active:scale-[0.98] disabled:cursor-not-allowed disabled:text-muted-foreground hover:disabled:bg-transparent"
							onclick={nextPage}
						>
							<CaretRight class="size-6" />
						</Pagination.NextButton>
					</div>
					<p class="text-center text-[13px] text-muted-foreground">
						Showing {range.start} - {range.end}
					</p>
				{/snippet}
			</Pagination.Root>
		</div>
		<button
			class="absolute end-5 rounded-full px-3 py-2 hover:bg-gray-300"
			onclick={(e) => {
				e.preventDefault();
				toggleSelectionModalState();
			}}>✕</button
		>
	</div>
</Modal>
