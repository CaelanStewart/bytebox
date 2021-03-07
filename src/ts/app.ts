// import {createApp} from 'vue';
// import App from '@/components/app.vue';
//
// createApp(App)
//     .mount('#root');

import ArrayIterator from '@/lib/traversal/array-iterator';
import ChunkedArrayIterator from '@/lib/traversal/chunked-array-iterator';

const array = [1, true, 3, false, 5, true];

const iterator = new ChunkedArrayIterator<[number, boolean]>({
    array,
    chunkSize: 2,
    startIndex: 0
});

// const iterator = new ArrayIterator<number>({
//     array,
//     startIndex: 1,
//     endIndex: 7
// });

for (const [one, two] of iterator) {
    console.log(one, two);
}

iterator.each(([one, two]) => {
    console.log(one, two);
});