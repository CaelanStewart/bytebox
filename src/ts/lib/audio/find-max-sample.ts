export default function findMaxSample(data: ArrayLike<number>): number {
    let max = 0;

    for (let i = 0; i < data.length; i++) {
        const abs = Math.abs(data[i]);

        if (abs > max) {
            max = abs;
        }
    }

    return max;
}