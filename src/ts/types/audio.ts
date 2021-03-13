export interface AudioData {
    readonly sampleRate: number;
    readonly samples: Float32Array;
}

export interface AnyAudioData {
    sampleRate: number;
    samples: ArrayLike<number>;
}

export interface MultiChannelAudioData {
    readonly sampleRate: number;
    readonly channelData: Float32Array[];
}
