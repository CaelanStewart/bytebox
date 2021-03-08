export interface AudioData {
    readonly sampleRate: number;
    readonly samples: Float32Array;
}

export interface MultiChannelAudioData {
    readonly sampleRate: number;
    readonly channelData: Float32Array[];
}
