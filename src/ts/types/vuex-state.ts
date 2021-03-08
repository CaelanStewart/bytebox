import {MultiChannelAudioData} from '@/types/audio';

export interface VuexState {
    sample: MultiChannelAudioData | null;
}