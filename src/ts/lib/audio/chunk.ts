export function chunk(data: Float32Array, size: number): Float32Array[] {
    const count = Math.ceil(data.length / size);
    const chunks = Array(count).fill(null).map(() => new Float32Array(size));

    for (let i = 0, l = data.length; i < l; ++i) {
        const chunkIndex = Math.floor(i / size);
        const chunkIndexSample = i % size;

        chunks[chunkIndex][chunkIndexSample] = data[i];
    }

    return chunks;
}