import {ComponentCustomProperties} from 'vue';
import {Store} from 'vuex';
import {VuexState} from '@/types/vuex-state';

declare module '@vue/runtime-core' {
    interface State extends VuexState {}

    interface ComponentCustomProperties {
        $store: Store<State>;
    }
}