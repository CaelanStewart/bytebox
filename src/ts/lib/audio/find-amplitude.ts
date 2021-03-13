import {roundToTolerance} from '@/lib/util';
import findMaxSample from '@/lib/audio/find-max-sample';
import {AnyAudioData} from '@/types/audio';
import createIterator from '@/lib/traversal/iterator/factories/audio-data-iterator';

interface Options {
    chunkTimeMs: number;
    tolerance: number;
    max: number;
    min: number;
}

export type CtorOptions = Optional<Options, 'tolerance'|'chunkTimeMs'>;

export default class FindAmplitude {
    private readonly options: Options;

    constructor(options: CtorOptions) {
        this.options = FindAmplitude.resolveOptions(options);

        if (this.options.tolerance <= 0) {
            throw new Error(`Invalid tolerance of ${this.options.tolerance} encountered`);
        }
    }

    private static resolveOptions(options: CtorOptions): Options {
        return {
            tolerance: 0.1,
            chunkTimeMs: 5,
            ...options
        }
    }

    findMode(data: AnyAudioData): number {
        const amplitudes = this.getAmplitudesInRange(data);
        const map = this.getAmplitudeCountMap(amplitudes);
        const sortedByCount = this.sortAmplitudesByCount(map);

        return sortedByCount[sortedByCount.length - 1];
    }

    findAverage(data: AnyAudioData) {
        const amplitudes = this.getAmplitudesInRange(data);
        let total = 0;

        for (let i = 0, l = amplitudes.length; i < l; ++i) {
            total += amplitudes[i];
        }

        return total / amplitudes.length;
    }

    sortAmplitudesByCount(map: Map<number, number>): number[] {
        const tiers = [...map.keys()];

        tiers.sort((a, b) => <number> map.get(a) - <number> map.get(b));

        return tiers;
    }

    getAmplitudeCountMap(amplitudes: number[]) {
        const map = new Map<number, number>();

        for (const amp of amplitudes) {
            map.set(amp, (map.get(amp) ?? 0) + 1);
        }

        return map;
    }

    getAmplitudes(data: AnyAudioData): number[] {
        return this.getIterator(data)
            .map(chunk => roundToTolerance(findMaxSample(chunk), this.options.tolerance));
    }

    getAmplitudesInRange(data: AnyAudioData): number[] {
        return this.getAmplitudes(data)
            .filter(amp => amp <= this.options.max && amp >= this.options.min);
    }

    getIterator(data: AnyAudioData) {
        return createIterator(data, this.options.chunkTimeMs);
    }

    static make(options: CtorOptions) {
        return new this(options);
    }

    static findMode(options: CtorOptions & {data: AnyAudioData}): number {
        return this.make(options).findMode(options.data);
    }
}