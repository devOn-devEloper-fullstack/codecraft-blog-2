<script lang="ts" generics="TData, TValue">
	import {
		type ColumnDef,
		type PaginationState,
		type SortingState,
		getCoreRowModel,
		getPaginationRowModel,
		getSortedRowModel
	} from '@tanstack/table-core';
	import type { PostsDataTable } from '../../../types';
	import {
		createSvelteTable,
		renderComponent,
		FlexRender,
		Pagination
	} from '$lib/components/ui/data-table/index';
	import ColumnSortButton from '$lib/components/ui/data-table/column-sort-button.svelte';
	import UserPostsButton from './UserPostsButton.svelte';
	import UserPostsDates from './UserPostsDates.svelte';
	import UserPostsStatus from './UserPostsStatus.svelte';

	const columns: ColumnDef<PostsDataTable>[] = [
		{
			accessorKey: 'postTitle',
			header: ({ column }) =>
				renderComponent(ColumnSortButton, {
					columnTitle: 'Post Title',
					sortDirection: column.getIsSorted(),
					onclick: () => {
						const currentSort = column.getIsSorted();
						if (currentSort === false) {
							column.toggleSorting(false);
						} else if (currentSort === 'asc') {
							column.toggleSorting(true);
						} else {
							column.clearSorting();
						}
					}
				})
		},
		{
			accessorKey: 'tags',
			header: ({ column }) =>
				renderComponent(ColumnSortButton, {
					columnTitle: 'Post Tags',
					sortDirection: column.getIsSorted(),
					onclick: () => {
						const currentSort = column.getIsSorted();
						if (currentSort === false) {
							column.toggleSorting(false);
						} else if (currentSort === 'asc') {
							column.toggleSorting(true);
						} else {
							column.clearSorting();
						}
					}
				})
		},
		{
			accessorKey: 'published',
			header: ({ column }) =>
				renderComponent(ColumnSortButton, {
					columnTitle: 'Post Status',
					sortDirection: column.getIsSorted(),
					onclick: () => {
						const currentSort = column.getIsSorted();
						if (currentSort === false) {
							column.toggleSorting(false);
						} else if (currentSort === 'asc') {
							column.toggleSorting(true);
						} else {
							column.clearSorting();
						}
					}
				})
		},
		{
			accessorKey: 'createdAt',
			header: ({ column }) =>
				renderComponent(ColumnSortButton, {
					columnTitle: 'Post Creation Date',
					sortDirection: column.getIsSorted(),
					onclick: () => {
						const currentSort = column.getIsSorted();
						if (currentSort === false) {
							column.toggleSorting(false);
						} else if (currentSort === 'asc') {
							column.toggleSorting(true);
						} else {
							column.clearSorting();
						}
					}
				})
		},
		{
			accessorKey: 'publishedAt',
			header: ({ column }) =>
				renderComponent(ColumnSortButton, {
					columnTitle: 'Post Publish Date',
					sortDirection: column.getIsSorted(),
					onclick: () => {
						const currentSort = column.getIsSorted();
						if (currentSort === false) {
							column.toggleSorting(false);
						} else if (currentSort === 'asc') {
							column.toggleSorting(true);
						} else {
							column.clearSorting();
						}
					}
				})
		},
		{
			accessorKey: 'view',
			header: ({ column }) =>
				renderComponent(ColumnSortButton, {
					columnTitle: 'View Post',
					sortDirection: column.getIsSorted(),
					onclick: () => {
						const currentSort = column.getIsSorted();
						if (currentSort === false) {
							column.toggleSorting(false);
						} else if (currentSort === 'asc') {
							column.toggleSorting(true);
						} else {
							column.clearSorting();
						}
					}
				})
		},
		{
			accessorKey: 'edit',
			header: ({ column }) =>
				renderComponent(ColumnSortButton, {
					columnTitle: 'Edit Post',
					sortDirection: column.getIsSorted(),
					onclick: () => {
						const currentSort = column.getIsSorted();
						if (currentSort === false) {
							column.toggleSorting(false);
						} else if (currentSort === 'asc') {
							column.toggleSorting(true);
						} else {
							column.clearSorting();
						}
					}
				})
		}
	];

	// PROPERTIES:
	//  - data:
	//

	type DataTableProps<PostsDataTable> = {
		data: PostsDataTable[];
		includeDates: boolean;
	};

	let { data, includeDates }: DataTableProps<PostsDataTable> = $props();

	// STATE VARIABLES/SIGNALS:

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 5 });
	let sorting = $state<SortingState>([]);
	let columnVisibility = $state({
		postTitle: true,
		tags: true,
		published: true,
		createdAt: includeDates,
		publishedAt: includeDates,
		view: true,
		edit: true
	});

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			columnVisibility
		},
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel()
	});
</script>

<div>
	<div>
		<table
			class="w-[100%] table-auto overflow-hidden rounded-xl border border-gray-300 dark:bg-[var(--dark)] dark:text-white"
		>
			<thead
				class="h-[55px] bg-[var(--primary)] text-left text-xl text-white dark:bg-[var(--primary-500)]"
			>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<tr>
						{#each headerGroup.headers as header (header.id)}
							<th class="px-4 py-2 whitespace-nowrap">
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</th>
						{/each}
					</tr>
				{/each}
			</thead>
			<tbody>
				{#each table.getRowModel().rows as row (row.id)}
					<tr
						class="h-[45px] border-b border-gray-200 bg-gray-100 px-4 py-2 text-left text-xl whitespace-nowrap"
					>
						{#each row.getVisibleCells() as cell}
							<td class="px-4 dark:bg-[var(--dark)] dark:text-white">
								{#if cell.column.id === 'postId' || cell.column.id === 'title' || cell.column.id === 'slug'}
									{cell.getValue()}
								{:else if cell.column.id === 'tags'}
									<div class="space-between my-4 flex w-[100%] flex-row items-center gap-4">
										{#each String(cell.getValue() ?? '')
											.split(',')
											.map((s) => s.trim())
											.filter(Boolean) as tag, i (i)}
											<span
												class="w-fit rounded-full bg-white px-5 py-1.5 text-sm font-semibold text-black"
												>{tag}</span
											>
										{/each}
									</div>
								{:else if cell.column.id === 'view'}
									<div class="flex w-full justify-center">
										<UserPostsButton
											href={cell.getValue() as string}
											content="View"
											class="bg-[var(--primary)] px-5 py-3 text-xl dark:bg-[var(--primary-500)]"
										/>
									</div>
								{:else if cell.column.id === 'edit'}
									<div class="flex w-full justify-center">
										<UserPostsButton
											href={cell.getValue() as string}
											content="Edit"
											class="bg-[var(--primary)] px-5 py-3 text-xl dark:bg-[var(--primary-500)]"
										/>
									</div>
								{:else if includeDates && (cell.column.id === 'createdAt' || cell.column.id === 'publishedAt')}
									<div class="flex justify-center">
										<UserPostsDates date={cell.getValue() as string} />
									</div>
								{:else if cell.column.id === 'published'}
									<UserPostsStatus status={cell.getValue() as boolean} />
								{:else}
									{cell.getValue()}
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
		<footer class="flex w-[100%] items-center justify-center">
			<Pagination tableModel={table} />
		</footer>
	</div>
</div>
