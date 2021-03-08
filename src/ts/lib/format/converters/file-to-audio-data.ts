import fileToArrayBuffer from '@/lib/format/converters/file-to-array-buffer';
import arrayBufferToAudioData from '@/lib/format/converters/array-buffer-to-audio-data';
import {MultiChannelAudioData} from '@/types/audio';

export default async function fileToAudioData(file: File): Promise<MultiChannelAudioData> {
    return arrayBufferToAudioData(
        await fileToArrayBuffer(file)
    )
}