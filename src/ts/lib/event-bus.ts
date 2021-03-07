import {Callback as Listener} from '@/types/function';

export type ArgumentTypeMap = {
    [name: string]: any[];
}

export type Store<Types extends ArgumentTypeMap = ArgumentTypeMap> = {
    [K in keyof Types]?: Listener<Types[K]>[];
}

export default function createEventBus<Types extends ArgumentTypeMap = ArgumentTypeMap>() {
    const listeners: Store<Types> = {};

    function on<N extends keyof Types>(event: N, listener: Listener<Types[N]>): void {
        listeners[event] = listeners[event] ?? [];

        listeners[event]?.push(listener);
    }

    function off<N extends keyof Types>(event: N, listener: Listener<Types[N]>): void {
        const stack = listeners[event];

        if (stack !== undefined) {
            const index = stack.lastIndexOf(listener);

            if (index !== -1) {
                stack.splice(index, 1);
            }
        }
    }

    function removeAll<N extends keyof Types>(): void {
        for (const event in listeners) {
            if (listeners.hasOwnProperty(event)) {
                delete listeners[event];
            }
        }
    }

    function emit<N extends keyof Types, A extends Types[N]>(event: N, ...args: A): void {
        listeners[event]?.forEach(listener => listener(...args));
    }

    return {
        on,
        off,
        removeAll,
        emit
    }
}