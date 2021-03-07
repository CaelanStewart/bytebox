import ArrayIterator from '@/lib/traversal/array-iterator';
import {MonoAudioData} from '@/types/audio';

export default class SliceArray {
    private audio: MonoAudioData;
    private readonly slices: [number, number][];

    [Symbol.iterator] = () => this.iterator().nativeIterator();

    constructor(audio: MonoAudioData, slices: [number, number][] = []) {
        this.audio = audio;
        this.slices = slices;
    }

    get length(): number {
        return this.getLength();
    }

    getLength(): number {
        return this.slices.length / 2;
    }

    push(start: number, end: number) {
        this.slices.push([start, end]);
    }

    get(index: number) {
        const slice = this.slices[index];

        if (slice) {
            return this.iteratorForSlice(...slice);
        }
    }

    iteratorForSlice(startIndex: number, endIndex: number) {
        return new ArrayIterator({
            array: this.audio.samples,
            startIndex,
            endIndex
        })
    }

    has(index: number) {
        return index >= 0 && index < this.slices.length;
    }

    iterator() {
        return new ArrayIterator<[number, number], ArrayIterator<number>>({
            array: this.slices,
            transformer: slice => {
                if (slice) {
                    return this.iteratorForSlice(...slice);
                }
            }
        })
    }
}