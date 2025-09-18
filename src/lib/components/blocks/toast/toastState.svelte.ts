import { getContext, onDestroy, setContext } from "svelte";


export type ToastType = {
    id: string,
    title: string,
    message: string,
    type: 'success' | 'error' | 'warn' | 'info'
}


/**
 * State Management for Appwide Toast Notifications
 */
export class Toast {
    toasts = $state<ToastType[]>([]);
    toastToTimeoutMap = new Map<string, ReturnType<typeof setTimeout>>();

    constructor() {
        onDestroy(() => {
			for (const timeout of this.toastToTimeoutMap.values()) {
				clearTimeout(timeout);
			}
			this.toastToTimeoutMap.clear();
		});
    }

    add(title: string, message: string, type: 'success' | 'error' | 'warn' | 'info' = 'info', durationMs = 500000) {
        const id = crypto.randomUUID();
		this.toasts.push({
			id,
			title,
			message,
			type,
		});
		this.toastToTimeoutMap.set(id, setTimeout(() => this.remove(id), durationMs));
    }

    remove(id: string) {
        const timeout = this.toastToTimeoutMap.get(id);
		if (timeout) {
			clearTimeout(timeout);
			this.toastToTimeoutMap.delete(id);
		}
		this.toasts = this.toasts.filter((toast) => toast.id !== id);
    }
}

const TOAST_KEY = Symbol('TOAST');

export function setToastState() {
	return setContext(TOAST_KEY, new Toast());
}

export function getToastState() {
	return getContext<ReturnType<typeof setToastState>>(TOAST_KEY);
}