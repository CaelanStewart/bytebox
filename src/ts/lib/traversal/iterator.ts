import {Optional} from '@/types/util';
import AbstractIterator, {Options as SuperOptions} from '@/lib/traversal/abstract-iterator';

export interface Options<V, T> extends SuperOptions<V, T> {
    get(index: number): V | undefined;
}

export type ResolvedOptions<V, T> = Optional<Required<Options<V, T>>, 'transformer'>;

export default class Iterator<V, T> extends AbstractIterator<V, T> {
    protected readonly options: ResolvedOptions<V, T>;

    constructor(options: Options<V, T>) {
        super(options);

        this.options = this.resolveOptions(options);
    }

    clone(): Iterator<V, T> {
        return new Iterator<V, T>(this.options);
    }

    protected resolveOptions(options: Options<V, T>): ResolvedOptions<V, T> {
        return {
            ...super.resolveOptions(options),
            ...options
        }
    }

    resolveIndex(index: number) {
        return this.options.get(index);
    }

    indexInRange(index: number): boolean {
        return index >= this.options.startIndex && index <= this.options.endIndex;
    }
}