import {ref, watch} from 'vue';
import useChooseFile from '@/composable/input/choose-file';
import fileToAudioData from '@/lib/format/converters/file-to-audio-data';

import {MultiChannelAudioData} from '@/types/audio';

export default function useChooseWavFile() {
    const audioData = ref<MultiChannelAudioData>();
    const error = ref<Error>();
    const chooseFile = useChooseFile();

    watch(chooseFile.file, async () => {
        try {
            if (chooseFile.file.value) {
                audioData.value = await fileToAudioData(chooseFile.file.value);
            }
        } catch (error) {
            error.value = error;

            throw error;
        }
    })

    return {
        ...chooseFile,
        audioData,
        error
    }
}