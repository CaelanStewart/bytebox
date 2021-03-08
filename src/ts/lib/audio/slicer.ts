import SliceArray from '@/lib/audio/slices';
import {Optional} from '@/types/util';
import {AudioData} from '@/types/audio';
import ChunkedIterator, {Options as ChunkedArrayIteratorOptions} from '@/lib/traversal/iterator/chunked-iterator';
import FindNoiseFloor from '@/lib/audio/find-noise-floor';
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
            chunkTimeMs: 10,
            ...options
        }
    }

    inferThreshold() {
        return FindNoiseFloor.find({
            data: this.options.data
        });
    }

    findSliceIndices() {
        const slices = new SliceArray(this.options.data);

        this.getIterator().each(chunk => {

        })
    }

    getIterator() {
        return createIterator(this.options.data, this.options.chunkTimeMs);
    }
}