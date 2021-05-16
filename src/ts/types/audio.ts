export type AnySampleArray = ArrayLike<number>;

export interface AudioData {
    readonly sampleRate: number;
    readonly samples: Float32Array;
}

export interface AnyAudioData {
    sampleRate: number;
    samples: AnySampleArray;
}

export interface MultiChannelAudioData {
    readonly sampleRate: number;
    readonly channelData: Float32Array[];
}
