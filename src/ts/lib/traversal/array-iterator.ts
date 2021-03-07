import {Optional} from '@/types/util';
import AbstractIterator, {Iteratee, Options as SuperOptions} from '@/lib/traversal/abstract-iterator';

export {Iteratee};

export interface Options<V, T> extends SuperOptions<V, T> {
    array: ArrayLike<V>;
}

export type ResolvedOptions<V, T> = Optional<Required<Options<V, T>>, 'transformer'>;

export type CtorOptions<V, T> = Optional<Options<V, T>, 'endIndex'>;

export default class ArrayIterator<V, T = V> extends AbstractIterator<V, T> {
    protected options: ResolvedOptions<V, T>;

    constructor(opts: CtorOptions<V, T>) {
        const superOptions = {
            endIndex: opts.array.length,
            ...opts
        };

        super(superOptions);

        this.options = this.resolveOptions(superOptions);

        this.validateOptions();
    }

    clone(): ArrayIterator<V, T> {
        return new ArrayIterator<V, T>(this.options);
    }

    protected validateOptions() {
        super.validateOptions();

        if (this.options.endIndex > this.options.array.length) {
            throw new Error('The given endIndex exceeds the given array\'s length');
        }
    }

    protected resolveOptions(options: Options<V, T>): ResolvedOptions<V, T> {
        return {
            ...options,
            ...super.resolveOptions(options)
        }
    }

    resolveIndex(index: number): V | undefined {
        return this.options.array[this.index];
    }
}