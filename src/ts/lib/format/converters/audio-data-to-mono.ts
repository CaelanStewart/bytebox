import {AudioData, MonoAudioData} from '@/types/audio';

export default function convertAudioDataToMono(data: AudioData, channel: number = 0): MonoAudioData {
    return {
        sampleRate: data.sampleRate,
        samples: data.channelData[channel]
    }
}