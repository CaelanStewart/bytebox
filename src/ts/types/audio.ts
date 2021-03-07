export interface AudioData {
    readonly sampleRate: number;
    readonly channelData: Float32Array[];
}

export interface MonoAudioData {
    readonly sampleRate: number;
    readonly samples: Float32Array;
}