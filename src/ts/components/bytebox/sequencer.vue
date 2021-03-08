<template>
    <div class="sequencer">

    </div>
</template>

<script lang="ts">
    import {defineComponent, PropType} from 'vue';
    import {AudioData} from '@/types/audio';

    export default defineComponent({
        name: 'bytebox-sequencer',

        props: {
            sample: Object as PropType<AudioData>
        }
    })
</script>