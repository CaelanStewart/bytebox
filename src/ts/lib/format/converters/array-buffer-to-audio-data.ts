import {decode} from '@/lib/audio/node-wav';

import {MultiChannelAudioData} from '@/types/audio';

export default function arrayBufferToAudioData(buffer: ArrayBuffer): MultiChannelAudioData {
    return decode(buffer);
}