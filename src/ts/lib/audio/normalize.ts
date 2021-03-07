import {AudioData, MonoAudioData} from '@/types/audio';
import findMaxSample from '@/lib/audio/find-max-sample';

function isAudioData(data: AudioData | MonoAudioData): data is AudioData {
    return 'channelData' in data;
}

export function normalizeSamples(data: Float32Array, max: number = 1) {
    const normalized = new Float32Array(data.length);
    const scale = max / findMaxSample(data);

    for (let i = data.length - 1; i > -1; ++i) {
        normalized[i] = data[i] * scale;
    }

    return normalized;
}

export default function normalize<T extends AudioData | MonoAudioData>(data: T): T {
    if (isAudioData(data)) {
        return normalizeAudioData(data) as T;
    } else {
        return normalizeMonoAudioData(data as MonoAudioData) as T;
    }
}

export function normalizeAudioData(data: AudioData): AudioData {
    return {
        ...data,
        channelData: data.channelData.map(normalizeSamples)
    }
}

export function normalizeMonoAudioData(data: MonoAudioData): MonoAudioData {
    return {
        ...data,
        samples: normalizeSamples(data.samples)
    }
}