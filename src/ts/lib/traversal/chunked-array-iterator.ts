import {arraySlice} from '@/lib/util';
import {Optional} from '@/types/util';
import AbstractIterator , {Options as SuperOptions} from '@/lib/traversal/abstract-iterator';

export interface Options<V extends any[], T extends any> extends SuperOptions<V, T> {
    array: ArrayLike<V[number]>;
    chunkSize: number;
}

export type ResolvedOptions<V extends any[], T> = Optional<Required<Options<V, T>>, 'transformer'>;

export type CtorOptions<V extends any[], T> = Optional<Options<V, T>, 'endIndex'>;

export default class ChunkedArrayIterator<V extends any[], T extends any = V> extends AbstractIterator<V, T> {
    protected options: ResolvedOptions<V, T>;

    constructor(opts: CtorOptions<V, T>) {
        const preOptions = {
            endIndex: opts.array.length / (opts.chunkSize ?? 1),
            ...opts
        };

        super(preOptions);

        this.options = this.resolveOptions(preOptions);

        this.validateOptions();
    }

    clone(): ChunkedArrayIterator<V, T> {
        return new ChunkedArrayIterator<V, T>(this.options);
    }

    protected validateOptions() {
        super.validateOptions();

        if (this.options.endIndex * this.options.chunkSize > this.options.array.length) {
            throw new Error('The given endIndex exceeds the given array\'s length');
        }

        if (this.options.array.length % this.options.chunkSize !== 0) {
            throw new Error('The array length must be a multiple of the chunk size');
        }
    }

    protected resolveOptions(options: Options<V, T>): ResolvedOptions<V, T> {
        return {
            ...super.resolveOptions(options),
            ...options
        }
    }

    protected getRealIndex(index: number = this.index) {
        return index * this.options.chunkSize;
    }

    resolveIndex(index: number): V | undefined {
        const realIndex = this.getRealIndex();

        return arraySlice(this.options.array, realIndex, realIndex + this.options.chunkSize) as V;
    }
}