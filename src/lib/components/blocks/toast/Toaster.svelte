<script>
    import { getToastState } from './toastState.svelte';
    import Toast from './Toast.svelte';

    const toastState = getToastState();
</script>

<div class="fixed top-2 left-1/2 translate-x-[-50%] z-3 flex flex-col items-center justify-center gap-2">
	{#each toastState.toasts as toast}
		<Toast {toast} />
	{/each}
</div>