// Somehow, absolutely beyond my belief, the far more abstracted and complex custom
// Iterator class hierarchy is FASTER than the simple, bare bones rendition used for test3.

// Test Results (very consistent in Chrome)
// test1: 1341.54296875 ms
// test2: 1139.291015625 ms
// test3: 1743.509033203125 ms

import createIterator from '@/performance-tests/iterator/alt-iterator';
import ArrayIterator from '@/lib/traversal/iterator/array-iterator';
import ChunkedIterator from '@/lib/traversal/iterator/chunked-iterator';

const array = new Float32Array(10000000);

for (let i = 0; i < array.length; ++i) {
    array[i] = Math.random();
}

// const iterator = new ChunkedArrayIterator<[number, boolean]>({
//     array,
//     chunkSize: 2,
//     startIndex: 0
// });

const iterator = ArrayIterator.new(array);

const iterator2 = {
    [Symbol.iterator]: () => createIterator({
        array
    })
};

function test1() {
    let i1 = 0;

    for (const float of iterator) {
        i1 += float;
    }

    return i1;
}

function test2() {
    let i2 = 0;

    iterator.each(float => {
        i2 += float;
    });

    return i2;
}

function test3() {
    let i3 = 0;

    for (const float of iterator2) {
        i3 += float;
    }

    return i3;
}

function call(name: string, fn: () => number, count: number) {
    console.time(name);
    let t = 0;

    for (let i = 0; i < count; ++i) {
        t+= fn();
    }

    console.timeEnd(name);

    return t;
}

function test() {
    console.log(call('test1', test1, 10));
    console.log(call('test2', test2, 10));
    console.log(call('test3', test3, 10));
}

(window as any).test = test;