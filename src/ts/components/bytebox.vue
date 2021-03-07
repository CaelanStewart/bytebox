<template>
    <div class="bytebox">
        <div class="main">
            <sidebar />
            <sequencer :sample="sample" />
        </div>
        <sampler @change="onSampleChange" />
    </div>
</template>

<style lang="scss">
    .bytebox {
        display: flex;
        flex-direction: column;

        > .main {
            flex-grow: 1;
        }

        > .sampler {
            flex-grow: 0;
        }
    }
</style>

<script lang="ts">
    // Modules
    import {defineComponent, ref} from 'vue';

    // Types
    import {AudioData} from '@/types/audio';

    // Components
    import Sidebar from '@/components/bytebox/sidebar.vue';
    import Sequencer from '@/components/bytebox/sequencer.vue';
    import Sampler from '@/components/bytebox/sampler.vue';

    export default defineComponent({
        name: 'bytebox',

        components: {
            Sidebar,
            Sequencer,
            Sampler
        },

        setup() {
            const sample = ref<AudioData>();
            const onSampleChange = (data: AudioData) => sample.value = data;

            return {
                sample,
                onSampleChange
            }
        }
    })
</script>