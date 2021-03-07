import {Callback as Listener} from '@/types/function';

export default function createBus<Args extends any[]>() {
    const listeners: Listener<Args>[] = [];

    function listen(listener: Listener<Args>): void {
        listeners.push(listener);
    }

    function stop(listener: Listener<Args>): void {
        const index = listeners.lastIndexOf(listener);

        if (index !== -1) {
            listeners.splice(index, 1);
        }
    }

    function emit(...args: Args): void {
        listeners.forEach(listener => listener(...args));
    }

    function removeAll() {
        listeners.splice(0, Infinity);
    }

    return {
        listen,
        stop,
        emit,
        removeAll
    }
}