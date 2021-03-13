import {AnyAudioData} from '@/types/audio';
import ChunkedIterator, {CtorOptions} from '@/lib/traversal/iterator/chunked-iterator';

export default function createIterator(data: AnyAudioData, chunkTimeMs: number, options: Partial<CtorOptions<number[]>> = {}) {
    return ChunkedIterator.new(data.samples, {
        ...options,
        chunkSize: Math.round(data.sampleRate / 1000 * chunkTimeMs),
        allowRemainder: true
    });
}