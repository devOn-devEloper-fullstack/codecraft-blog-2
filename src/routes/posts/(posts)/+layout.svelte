<script lang="ts">
    import { setToastState } from '$lib/components/blocks/toast/toastState.svelte';
    import Toaster from '$lib/components/blocks/toast/Toaster.svelte';
	import type { LayoutProps } from '../../$types';


    let { children }: LayoutProps = $props();

    setToastState();
</script>

<Toaster />

<main>
    {@render children?.() }
</main>
