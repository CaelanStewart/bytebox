import {roundToTolerance} from '@/lib/util';
import findMaxSample from '@/lib/audio/find-max-sample';
import {AudioData} from '@/types/audio';
import createIterator from '@/lib/traversal/iterator/factories/audio-data-iterator';

interface Options {
    data: AudioData;
    chunkTimeMs: number;
    tolerance: number;
    threshold: number;
}

export type CtorOptions = Optional<Options, 'tolerance'|'chunkTimeMs'|'threshold'>;

export default class FindNoiseFloor {
    private readonly options: Options;

    constructor(options: CtorOptions) {
        this.options = FindNoiseFloor.resolveOptions(options);
    }

    private static resolveOptions(options: CtorOptions): Options {
        return {
            tolerance: 0.1,
            chunkTimeMs: 5,
            threshold: 0.5,
            ...options
        }
    }

    find(): number {
        const amplitudes = this.getAmplitudesBelowThreshold();
        const map = this.getAmplitudeCountMap(amplitudes);
        const sortedByCount = this.sortAmplitudesByCount(map);

        return sortedByCount[sortedByCount.length - 1];
    }

    sortAmplitudesByCount(map: Map<number, number>): number[] {
        const tiers = [...map.keys()];

        tiers.sort((a, b) => <number> map.get(a) - <number> map.get(b));

        return tiers;
    }

    getAmplitudeCountMap(amplitudes: number[]) {
        const map = new Map<number, number>();

        amplitudes.forEach(amp => map.set(amp, (map.get(amp) ?? 0) + 1));

        return map;
    }

    getAmplitudes(): number[] {
        return this.getIterator()
            .map(chunk => roundToTolerance(findMaxSample(chunk), this.options.tolerance));
    }

    getAmplitudesBelowThreshold(): number[] {
        return this.getAmplitudes()
            .filter(amp => amp <= this.options.threshold);
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