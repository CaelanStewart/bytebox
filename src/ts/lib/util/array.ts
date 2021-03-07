export function arraySlice<T>(array: ArrayLike<T>, start: number, end: number): T[] {
    const slice = Array.prototype.slice.bind(array);

    return slice(start, end);
}