<template>
    <div class="sampler">
        <input-file @change="onInputChange" />

        <div class="actions">
            <button type="button">Preview</button>
        </div>
    </div>
</template>

<script lang="ts">
    import {defineComponent, watch, computed} from 'vue';
    import useChooseWavFile from '@/composable/input/choose-wav-file';
    import convertMultiChannelAudioDataToMono from '@/lib/format/converters/multi-channel-audio-data-to-mono';
    import normalize from '@/lib/audio/normalize';

    import {AudioData} from '@/types/audio';

    import InputFile from '@/components/input/file.vue';

    export default defineComponent({
        name: 'bytebox-sampler',

        components: {
            InputFile
        },

        setup(props, context) {
            const {audioData, error, onInputChange} = useChooseWavFile();

            const sample = computed<AudioData | null>(() => {
                const data = audioData.value;

                if (data) {
                    if (data.channelData.length) {
                        return normalize(
                            convertMultiChannelAudioDataToMono(data)
                        );
                    } else {
                        throw error.value = new Error('The chosen audio file contains no channels');
                    }
                }

                return null;
            });

            watch(sample, () => {
                context.emit('change', sample.value);
            });

            return {
                audioData,
                error,
                onInputChange
            }
        }
    })
</script>