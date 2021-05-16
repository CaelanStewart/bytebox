import {Optional} from '@/types/util';
import {Callback} from '@/types/function';

export interface Options<V, T> {
    endIndex: number;
    startIndex?: number;
    transformer?: (chunk: V | undefined) => T | undefined;
}

export type ResolvedOptions<V, T> = Optional<Required<Options<V, T>>, 'transformer'>;
// AbstractIterator<V,  T>
export type Iteratee<V, T, S extends AbstractIterator<V,  T>, R = any> = Callback<[V | T, S], R>;

export default abstract class AbstractIterator<V, T = never> {
    protected index: number;
    protected readonly options: ResolvedOptions<V, T>;

    protected constructor(options: Options<V, T>) {
        this.options = this.resolveOptions(options);
        this.index = this.options.startIndex;
    }

    abstract resolveIndex(index: number): V | undefined;

    [Symbol.iterator] = this.nativeIterator;

    abstract clone(): AbstractIterator<V,  T>;

    static new<V, T = never>(...args: any) {
        throw new Error('This method must be overridden in derived classes');
    }

    public nativeIterator() {
        this.begin();

        return {
            next: () => {
                return {
                    done: this.isOutOfRange(),
                    value: this.nextAndGetPrev() as V
                }
            }
        }
    }

    protected resolveOptions(options: Options<V, T>): ResolvedOptions<V, T> {
        return {
            startIndex: 0,
            ...options
        }
    }

    protected validateOptions() {
        if (this.options.startIndex < 0) {
            throw new Error('Given startIndex is negative');
        }

        if (this.options.endIndex < 0) {
            throw new Error('Given endIndex is negative');
        }

        if (this.options.startIndex > this.options.endIndex) {
            throw new Error('Given startIndex exceeds endIndex');
        }
    }

    get(index: number): V | T | undefined {
        if (this.options.transformer) {
            return this.options.transformer(this.resolveIndex(index));
        }

        return this.resolveIndex(index);
    }
    
    getPrev(index: number = this.index) {
        return this.get(index - 1);
    }
    
    getNext(index: number = this.index) {
        return this.get(index + 1);
    }

    indexInRange(index: number): boolean {
        return index < this.options.endIndex && index >= this.options.startIndex;
    }

    indexOutOfRange(index: number): boolean {
        return ! this.indexInRange(index);
    }

    inRange() {
        return this.indexInRange(this.index);
    }

    isOutOfRange() {
        return this.indexOutOfRange(this.index);
    }
    
    currentIndex() {
        return this.index;
    }

    current() {
        return this.get(this.index);
    }

    seek(index: number) {
        this.index = index;
    }

    move(offset: number) {
        return this.index = this.index + offset;
    }

    next() {
        return this.index = this.index + 1;
    }

    nextAndGetPrev() {
        const prev = this.current();

        this.next();

        return prev;
    }

    prev() {
        return this.index = this.index - 1;
    }

    begin() {
        return this.index = this.options.startIndex;
    }

    end() {
        return this.index = this.options.endIndex - 1;
    }

    hasNext(): boolean {
        return this.index + 1 < this.options.endIndex;
    }

    hasPrev(): boolean {
        return this.index - 1 >= this.options.startIndex;
    }

    isStart(): boolean {
        return this.index <= 0;
    }

    reduce<M, SELF extends this>(reducer: Callback<[V | T | M, V | T | M, SELF], M>, initial: M): M {
        let total = initial;

        this.each(value => {
            total = reducer(total, value, this as SELF);
        });
        
        return total;
    }

    map<M, SELF extends this>(mapper: Iteratee<V, T, SELF, M>): M[] {
        const map: M[] = Array(this.options.endIndex - this.options.startIndex - 1);
        let i = 0;

        this.each(value => {
            map[i] = mapper(value, this as SELF);
            ++i;
        });

        return map;
    }

    each<SELF extends this>(iteratee: Iteratee<V, T, SELF>): void {
        this.begin();

        for (; this.inRange(); this.next()) {
            iteratee(this.current() as V | T, this as SELF);
        }

        this.begin();
    }

    eachReverse<SELF extends this>(iteratee: Iteratee<V, T, SELF>): void {
        this.end();

        for (; this.inRange(); this.prev()) {
            iteratee(this.current() as V | T, this as SELF);
        }

        this.begin();
    }
}