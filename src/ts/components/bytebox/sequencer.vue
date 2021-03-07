<template>
    <div class="sequencer">

    </div>
</template>

<script lang="ts">
    import {defineComponent, PropType} from 'vue';
    import {AudioData} from '@/types/audio';

    import {Slices} from '@/lib/audio/slicer';

    export default defineComponent({
        name: 'bytebox-sequencer',

        props: {
            sample: Object as PropType<AudioData>
        }
    })
</script>