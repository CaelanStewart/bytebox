import {AudioData} from '@/types/audio';
import createIterator from '@/lib/traversal/iterator/factories/audio-data-iterator';

interface Options {
    data: AudioData;
    chunkTimeMs: number;
    tolerance: number;
}

export type CtorOptions = Optional<Options, 'tolerance'|'chunkTimeMs'>;

export default class FindNoiseFloor {
    private readonly options: Options;

    constructor(options: CtorOptions) {
        this.options = FindNoiseFloor.resolveOptions(options);
    }

    private static resolveOptions(options: CtorOptions): Options {
        return {
            tolerance: 0.1,
            chunkTimeMs: 5,
            ...options
        }
    }

    find(): number {
        const volumes = this.getAverageVolumes();

        return 0;
    }

    getAverageVolumes(): number[] {
        return this.getIterator()
            .map(chunk => chunk.reduce((a, b) => a + Math.abs(b), 0) / chunk.length);
    }

    getIterator() {
        return createIterator(this.options.data, this.options.chunkTimeMs);
    }

    static make(options: CtorOptions) {
        return new this(options);
    }

    static find(options: CtorOptions): number {
        return this.make(options).find();
    }
}