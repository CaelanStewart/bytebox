import Wav from 'node-wav';

/**
 * @param {ArrayBuffer} data
 * @return {{channelData: Float32Array[], sampleRate: number}}
 */
export function decode(data) {
    return Wav.decode(data);
}

export function encode(channelData, options) {
    return Wav.encode(channelData, options);
}