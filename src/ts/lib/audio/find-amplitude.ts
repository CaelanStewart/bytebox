import {roundToTolerance, msToLength} from '@/lib/util';
import findMaxSample from '@/lib/audio/find-max-sample';
import findAvgSample from '@/lib/audio/find-avg-sample';
import {AnyAudioData, AnySampleArray} from '@/types/audio';
import ChunkedIterator from '@/lib/traversal/iterator/chunked-iterator';

interface Options {
    sampleRate: number;
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

    findMode(data: AnySampleArray): number {
        const amplitudes = this.getAmplitudesInRange(data);
        
        if (amplitudes.length === 0) return 0;
        
        const map = this.getAmplitudeCountMap(amplitudes);
        const sortedByCount = this.sortAmplitudesByCount(map);

        return sortedByCount[sortedByCount.length - 1];
    }

    findAverage(data: AnySampleArray) {
        const amplitudes = this.getAmplitudesInRange(data);
        
        if (amplitudes.length) {
            return findAvgSample(amplitudes);
        }
        
        return 0;
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

    getAmplitudes(data: AnySampleArray): number[] {
        return this.getIterator(data)
            .map(chunk => roundToTolerance(findMaxSample(chunk), this.options.tolerance));
    }

    getAmplitudesInRange(data: AnySampleArray): number[] {
        return this.getAmplitudes(data)
            .filter(amp => amp <= this.options.max && amp >= this.options.min);
    }

    getIterator(data: AnySampleArray) {
        return ChunkedIterator.new(data, {
            chunkSize: msToLength(this.options.chunkTimeMs, this.options.sampleRate),
            allowRemainder: true
        });
    }

    static make(options: CtorOptions) {
        return new this(options);
    }

    static findMode(options: CtorOptions & {data: AnySampleArray}): number {
        return this.make(options).findMode(options.data);
    }

    static findAverage(options: CtorOptions & {data: AnySampleArray}): number {
        return this.make(options).findAverage(options.data);
    }
}