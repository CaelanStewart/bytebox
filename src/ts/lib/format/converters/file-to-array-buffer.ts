import {flatCallback} from '@/lib/util';

export default async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    const reader = new FileReader();

    await flatCallback(cb => {
        reader.onload = cb;
        reader.readAsArrayBuffer(file);
    });

    if (reader.result instanceof ArrayBuffer) {
        return reader.result;
    } else {
        throw new Error('Expected an ArrayBuffer');
    }
}