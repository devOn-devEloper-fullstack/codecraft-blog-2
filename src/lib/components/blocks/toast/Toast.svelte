<script lang="ts">
    import { getToastState, type ToastType } from './toastState.svelte';
    import { cn } from '$lib/utils';
    import X from 'phosphor-svelte/lib/X'
    import CheckCircle from 'phosphor-svelte/lib/CheckCircle'
    import Info from 'phosphor-svelte/lib/Info'
    import Warning from 'phosphor-svelte/lib/Warning'
    import WarningCircle from 'phosphor-svelte/lib/WarningCircle'


    let { toast} : { toast: ToastType } = $props();
    
    let className = $state('');
    let Icon = $state<typeof CheckCircle | typeof WarningCircle | typeof Info | typeof Warning | undefined>(undefined);

    switch (toast.type) {
        case 'success':
            className = 'text-green-800';
            Icon = CheckCircle;
            break;
        case 'error':
            className = 'text-red-800';
            Icon = WarningCircle;
            break;
        case 'info':
            className = 'text-blue-800';
            Icon = Info;
            break;
        case 'warn':
            className = 'text-yellow-800';
            Icon = Warning;
            break;
    }

    const toastState = getToastState();
</script>

<div class={cn(className, "relative px-4 py-3 flex w-90 flex-row gap-4 rounded-md border border-gray-500 shadow-md bg-white")}>
    <div class="flex items-center justify-center">
        <Icon size={32} />
    </div>

    <div class="flex flex-col">
        <span class="text-xl font-semibold">{toast.title}</span>
        <span class="text-[var(--primary)] text-md">{toast.message}</span>
        <button class="absolute top-2 right-2" onclick={() => toastState.remove(toast.id)}>
            <span class="sr-only">Remove toast</span>
            <X size={20} class="text-[var(--primary)] cursor-pointer hover:bg-gray-200 rounded-full"/>
        </button>
    </div>
    
    
</div>

