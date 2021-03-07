import {Callback} from '@/types/function';

export function flatCallback<T extends any[]>(executor: (callback: Callback<T>) => any): Promise<T> {
    return new Promise(resolve => {
        const wrapper = (...args: T) => resolve(args);

        executor(wrapper);
    })
}
