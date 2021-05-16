import SliceArray from '@/lib/audio/slices';
import {msToLength} from '@/lib/util';
import {Optional} from '@/types/util';
import {AudioData} from '@/types/audio';
import ChunkedIterator, {Options as ChunkedArrayIteratorOptions} from '@/lib/traversal/iterator/chunked-iterator';
import FindAmplitude from '@/lib/audio/find-amplitude';
import findAvgSample from '@/lib/audio/find-avg-sample';
import createIterator from '@/lib/traversal/iterator/factories/audio-data-iterator';

interface Options {
    data: AudioData;
    chunkTimeMs: number;
    threshold?: number;
    convergenceDivisor: number;
    minChunkTime: number;
}

export type CtorOptions = Optional<Options, 'chunkTimeMs'|'convergenceDivisor'>;

export default class Slicer {
    private readonly options: Options;

    private readonly threshold: number;
    
    private readonly findAmplitude: FindAmplitude;

    constructor(options: CtorOptions) {
        this.options = Slicer.resolveOptions(options);
        this.threshold = this.options.threshold ?? this.inferThreshold();
        this.findAmplitude = FindAmplitude.make({
            sampleRate: this.options.data.sampleRate,
            min: this.threshold,
            max: 1
        })
    }

    private static resolveOptions(options: CtorOptions): Options {
        return {
            chunkTimeMs: 5,
            convergenceDivisor: 3,
            ...options
        }
    }

    inferThreshold() {
        return FindAmplitude.findMode({
            sampleRate: this.options.data.sampleRate,
            data: this.options.data.samples,
            min: 0,
            max: 0.5
        });
    }
    
    findSliceIndices() {
        const slices = new SliceArray(this.options.data);
        
        this.getIterator().each((chunk, iter) => {
            const avg = findAvgSample(chunk);
            
            if (avg > this.threshold) {
                const start = this.findSliceBound(
                    iter.getRealIndex(),
                    this.options.chunkTimeMs / this.options.convergenceDivisor,
                    this.threshold / this.options.convergenceDivisor,
                    -1,
                    1
                );
                
                const end = -1;
            }
        });
    }
    
    findSliceBound(realIndex: number, chunkTime: number, threshold: number, direction: -1 | 1, handedness: 1 | -1, prevAvg: number = threshold): number {
        const iter = createIterator(this.options.data, chunkTime);
        
        // Seek to the closest chunk of the beginning of the chunk in the previous iteration
        iter.seek(iter.getVirtualIndex(realIndex));
        
        // Go to the next chunk in the current direction with the current handedness
        iter.move(direction * handedness);
        
        const avg = FindAmplitude.findAverage({
            data: iter.current() as number[],
            sampleRate: this.options.data.sampleRate,
            tolerance: 0.1,
            chunkTimeMs: chunkTime,
            max: 1,
            min: threshold
        });
        
        const newChunkTime = chunkTime / this.options.convergenceDivisor;
        
        if (newChunkTime >= this.options.minChunkTime) {
            // If the prev chunk in the current direction is below the threshold, we need to look the other way to find the limit
            const newDirection = ((avg < threshold && prevAvg >= threshold) ? -direction : direction) as 1 | -1;
            const newThreshold = threshold / this.options.convergenceDivisor;
            
            return this.findSliceBound(iter.getRealIndex(), newChunkTime, newThreshold, newDirection, handedness, avg);
        } else {
            return iter.getRealIndex();
        }
        
        return -1;
    }

    getIterator() {
        return createIterator(this.options.data, this.options.chunkTimeMs);
    }
}