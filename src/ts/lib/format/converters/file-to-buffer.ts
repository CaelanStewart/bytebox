import {Buffer} from 'buffer';
import fileToArrayBuffer from '@/lib/format/converters/file-to-array-buffer';

export default async function fileToBuffer(file: File): Promise<Buffer> {
    return new Buffer(
        await fileToArrayBuffer(file)
    );
}