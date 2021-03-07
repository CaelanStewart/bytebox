<template>
    <div class="bytebox-demo">
        <bytebox />
    </div>
</template>

<style lang="scss">
    .bytebox-demo {
        display: flex;
    }
</style>

<script lang="ts">
    import {defineComponent} from 'vue';
    import Bytebox from '@/components/bytebox.vue';

    export default defineComponent({
        name: 'bytebox-app',

        components: {
            Bytebox
        }
    })
</script>