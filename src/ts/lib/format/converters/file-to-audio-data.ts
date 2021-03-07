import fileToArrayBuffer from '@/lib/format/converters/file-to-array-buffer';
import arrayBufferToAudioData from '@/lib/format/converters/array-buffer-to-audio-data';
import {AudioData} from '@/types/audio';

export default async function fileToAudioData(file: File): Promise<AudioData> {
    return arrayBufferToAudioData(
        await fileToArrayBuffer(file)
    )
}