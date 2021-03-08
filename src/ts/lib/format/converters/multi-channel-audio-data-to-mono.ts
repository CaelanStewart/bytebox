import {MultiChannelAudioData, AudioData} from '@/types/audio';

export default function convertMultiChannelAudioDataToMono(data: MultiChannelAudioData, channel: number = 0): AudioData {
    return {
        sampleRate: data.sampleRate,
        samples: data.channelData[channel]
    }
}