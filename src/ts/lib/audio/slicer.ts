import SliceArray from '@/lib/audio/slices';
import {MonoAudioData} from '@/types/audio';

export default class Slicer {
    private data: MonoAudioData;

    constructor(data: MonoAudioData) {
        this.data = data;
    }

    findSliceIndices() {
        const slices = new SliceArray(this.data);

        
    }
}