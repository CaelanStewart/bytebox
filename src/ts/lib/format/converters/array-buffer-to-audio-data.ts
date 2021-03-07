import {decode} from '@/lib/audio/node-wav';

import {AudioData} from '@/types/audio';

export default function arrayBufferToAudioData(buffer: ArrayBuffer): AudioData {
    return decode(buffer);
}