import SliceArray from '@/lib/audio/slices';
import {Optional} from '@/types/util';
import {AudioData} from '@/types/audio';
import ChunkedIterator, {Options as ChunkedArrayIteratorOptions} from '@/lib/traversal/iterator/chunked-iterator';
import FindAmplitude from '@/lib/audio/find-amplitude';
import createIterator from '@/lib/traversal/iterator/factories/audio-data-iterator';

interface Options {
    data: AudioData;
    chunkTimeMs: number;
    threshold?: number;
}

export type CtorOptions = Optional<Options, 'chunkTimeMs'>;

export default class Slicer {
    private readonly options: Options;

    private readonly threshold: number;

    constructor(options: CtorOptions) {
        this.options = Slicer.resolveOptions(options);
        this.threshold = this.options.threshold ?? this.inferThreshold();
    }

    private static resolveOptions(options: CtorOptions): Options {
        return {
            chunkTimeMs: 5,
            ...options
        }
    }

    inferThreshold() {
        return FindAmplitude.findMode({
            data: this.options.data,
            min: 0,
            max: 0.5
        });
    }

    findSliceIndices() {
        const slices = new SliceArray(this.options.data);
        const findAmplitude = new FindAmplitude({
            max: 1,
            min: this.threshold,
            tolerance: 0.1
        });

        this.getIterator().each((chunk, iter) => {

        });
    }

    getIterator() {
        return createIterator(this.options.data, this.options.chunkTimeMs);
    }
}