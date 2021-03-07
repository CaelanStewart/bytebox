import {ref} from 'vue';

export default function useChooseFile() {
    const file = ref<File | null>();

    const onInputChange = (event: Event) => {
        const input = event.currentTarget as HTMLInputElement;

        file.value = input.files?.item(0) ?? null;
    };

    return {
        file,
        onInputChange
    }
}