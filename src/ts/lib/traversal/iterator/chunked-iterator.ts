import {arraySlice} from '@/lib/util';
import {Optional} from '@/types/util';
import AbstractIterator , {Options as SuperOptions} from '@/lib/traversal/iterator/abstract-iterator';

export interface Options<V extends ArrayLike<any>, T extends any = never> extends SuperOptions<V[number][], T> {
    array: ArrayLike<V[number]>;
    chunkSize: number;
    allowRemainder?: boolean;
}

export type ResolvedOptions<V extends ArrayLike<any>, T = never> = Optional<Required<Options<V, T>>, 'transformer'>;

export type CtorOptions<V extends ArrayLike<any>, T = never> = Optional<Options<V, T>, 'endIndex'>;

export default class ChunkedIterator<V extends ArrayLike<any>, T extends any = never> extends AbstractIterator<V[number][], T> {
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

    static new<V extends ArrayLike<any>, T extends any = never>(array: V, options: Optional<CtorOptions<V, Exclude<T, undefined>>, 'array'>): ChunkedIterator<V, Exclude<T, undefined>> {
        return new ChunkedIterator<V, Exclude<T, undefined>>({
            ...options,
            array
        });
    }

    clone(): ChunkedIterator<V, T> {
        return new ChunkedIterator<V, T>(this.options);
    }

    protected validateOptions() {
        super.validateOptions();

        if (this.options.endIndex * this.options.chunkSize > this.options.array.length) {
            throw new Error('The given endIndex exceeds the given array\'s length');
        }

        if (! this.options.allowRemainder && this.options.array.length % this.options.chunkSize !== 0) {
            throw new Error('The array length must be a multiple of the chunk size');
        }
    }

    protected resolveOptions(options: Options<V, T>): ResolvedOptions<V, T> {
        return {
            allowRemainder: false,
            ...super.resolveOptions(options),
            ...options
        }
    }
    
    getVirtualIndex(realIndex: number) {
        return Math.round(realIndex / this.options.chunkSize);
    }

    getRealIndex(index: number = this.index) {
        return index * this.options.chunkSize;
    }
    
    resolveRealIndex(realIndex: number) {
        return this.resolveIndex(this.getVirtualIndex(realIndex));
    }

    resolveIndex(index: number): V[number][] {
        const realIndex = this.getRealIndex(index);

        return arraySlice(this.options.array, realIndex, realIndex + this.options.chunkSize) as V[number][];
    }
}