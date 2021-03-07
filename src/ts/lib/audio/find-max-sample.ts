export default function findMaxSample(data: Float32Array): number {
    let max = 0;

    for (const sample of data) {
        const abs = Math.abs(sample);

        if (abs > max) {
            max = abs;
        }
    }

    return max;
}