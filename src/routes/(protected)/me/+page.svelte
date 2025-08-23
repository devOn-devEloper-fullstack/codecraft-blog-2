<script lang="ts">
	import type { LayoutProps } from '../$types';
	import { Timeline, TimelineItem } from 'flowbite-svelte';
	import { CalendarWeekSolid } from 'flowbite-svelte-icons';

	let { data }: LayoutProps = $props();
	let { session } = data;

	let { user } = session || {};
</script>

<div
	class="mx-4 mt-4 grid h-[100vh] w-[calc(100vw-40px-16px-20px)] grid-cols-[1.5fr_3fr_1.5fr] items-center gap-4 overflow-y-auto"
>
	<!-- LEFT SIDE PANEL: USER PROFILE AND SETTINGS SUBMENU -->
	<div class="flex h-[100%] w-[100%] flex-col gap-4">
		<div
			class="flex h-[40%] w-full flex-col items-center justify-items-start rounded-xl bg-gray-100 shadow-sm"
		>
			<div class="mt-5 h-[240px] w-[240px] rounded-xl border-4 border-white shadow-xl"></div>
			<span class="mt-2 text-xl">{user.name}</span>
			<span class="mt-2 rounded-xl bg-green-500 px-4 text-white opacity-50">Admin</span>
			<div class="mt-4 flex h-[140px] w-[75%] flex-row items-center justify-between px-8">
				<div class="flex h-[90px] w-[90px] items-end justify-center rounded-md bg-white shadow-xl">
					POSTS
				</div>
				<div class="flex h-[90px] w-[90px] items-end justify-center rounded-md bg-white shadow-xl">
					LIKES
				</div>
				<div class="flex h-[90px] w-[90px] items-end justify-center rounded-md bg-white shadow-xl">
					VIEWS
				</div>
			</div>
		</div>
		<div class="h-[calc(100%-40%-60px)] w-full rounded-xl bg-gray-100 p-4 shadow-sm">
			<span class="text-2xl font-semibold">Profile Settings</span>
		</div>
	</div>

	<!-- MIDDLE PANEL: PUBLISHED POSTS & POSTS AWAITING APPROVAL -->

	<div class="h-[100%] w-[100%] rounded-xl border border-black"></div>

	<!-- RIGHT SIDE PANEL: ACTIVITY FEED -->
	<div class="h-[100%] w-[100%] rounded-xl border border-black p-4">
		<h2 class="m border-b border-gray-400 pb-4 text-xl font-semibold">ACTIVITY FEED</h2>
		<div class="ml-4 flex flex-col">
			<Timeline order="vertical" class="mt-4">
				<TimelineItem
					title="Flowbite Application UI v2.0.0"
					date="Released on January 13th, 2022"
					class="ml-4 flex flex-col"
				>
					{#snippet orientationSlot()}
						<span
							class="absolute -start-5 z-30 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary-300)] ring-8 ring-white dark:bg-[var(--primary-900)] dark:ring-gray-900"
						>
							<!-- <CalendarWeekSolid
								class="text-color-primary-600 dark:text-color-primary-400 h-4 w-4"
							/> -->
						</span>
					{/snippet}
					<div class="absolute -start-2.5 h-full w-[3px] border border-[var(--primary-300)]"></div>
					<p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
						Get access to over 20+ pages including a dashboard layout, charts, kanban board,
						calendar, and pre-order E-commerce & Marketing pages.
					</p>
				</TimelineItem>
				<TimelineItem
					title="Flowbite Figma v1.3.0"
					date="Released on December 7th, 2021"
					class="ml-4 flex flex-col"
				>
					{#snippet orientationSlot()}
						<span
							class="absolute -start-5 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary-300)] ring-8 ring-white dark:bg-[var(--primary-900)] dark:ring-gray-900"
						>
							<!-- <CalendarWeekSolid
								class="text-color-primary-600 dark:text-color-primary-400 h-4 w-4"
							/> -->
						</span>
					{/snippet}
					<p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
						All of the pages and components are first designed in Figma and we keep a parity between
						the two versions even as we update the project.
					</p>
				</TimelineItem>
				<TimelineItem
					title="Flowbite Library v1.2.2"
					date="Released on December 2nd, 2021"
					class="ml-4 flex flex-col"
				>
					{#snippet orientationSlot()}
						<span
							class="absolute -start-5 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary-300)] ring-8 ring-white dark:bg-[var(--primary-900)] dark:ring-gray-900"
						>
							<CalendarWeekSolid class="dark:text-color-primary-400 h-4 w-4 text-white" />
						</span>
					{/snippet}
					<p class="text-base font-normal text-gray-500 dark:text-gray-400">
						Get started with dozens of web components and interactive elements built on top of
						Tailwind CSS.
					</p>
				</TimelineItem>
			</Timeline>
		</div>
	</div>
</div>
