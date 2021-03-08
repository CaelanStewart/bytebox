interface Options<V, T> {
    array: ArrayLike<V>;
    startIndex?: number;
    endIndex?: number;
    transformer?: (val: V) => T;
}

export default function createIterator<V, T = V>(options: Options<V, T>) {
    const {array, startIndex = 0, endIndex = array.length, transformer} = options;

    let i = startIndex;

    const inRange = () => i >= startIndex && i < endIndex;
    const getValue = (index: number) => transformer ? transformer(array[index]) : array[index];

    return {
        next() {
            const done = ! inRange();
            const value = done ? undefined : getValue(i++);

            return {
                done,
                // In practice, proper use of iterators will not yield a usage of the undefined value state
                value: value as V | T
            }
        }
    };
}