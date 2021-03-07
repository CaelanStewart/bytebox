import {createStore, Store} from 'vuex';
import {VuexState} from '@/types/vuex-state';

export default function createByteboxStore(): Store<VuexState> {
    return createStore<VuexState>({
        state: {
            sample: null
        },
        mutations: {
            setSample(state, sample: VuexState['sample']) {
                state.sample = sample;
            }
        }
    });
}