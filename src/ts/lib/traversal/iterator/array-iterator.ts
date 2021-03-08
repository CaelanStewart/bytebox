import {Optional} from '@/types/util';
import AbstractIterator, {Iteratee, Options as SuperOptions} from '@/lib/traversal/iterator/abstract-iterator';

export {Iteratee};

export interface Options<V, T = never> extends SuperOptions<V, T> {
    array: ArrayLike<V>;
}

export type ResolvedOptions<V, T = never> = Optional<Required<Options<V, T>>, 'transformer'>;

export type CtorOptions<V, T = never> = Optional<Options<V, T>, 'endIndex'>;

export default class ArrayIterator<V, T = never> extends AbstractIterator<V, T> {
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

    static new<V extends ArrayLike<any>, T extends any = never>(array: V, options: Optional<CtorOptions<V, NoUndefined<T>>, 'array'> = {}): ArrayIterator<V[number], NoUndefined<T>> {
        // We must Exclude undefined from T due to the usage of inference from the given argument types.
        // When the none of the type arguments are no explicitly specified, and are instead inferred, TypeScript
        // will assign the type undefined to T by default.
        return new ArrayIterator<V[number], NoUndefined<T>>({
            ...options,
            array
        });
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