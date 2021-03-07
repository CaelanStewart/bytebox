<template>
    <div class="input-file">
        <label class="button">
            <span>
                <input type="file" @change="onChange" />
            </span>
        </label>
    </div>
</template>

<style lang="scss">
    .input-file {
        label span {
            display: block;
            overflow: hidden;
            width: 0.1px;
            height: 0.1px;
        }
    }
</style>

<script lang="ts">
    import {defineComponent} from 'vue';

    export default defineComponent({
        name: 'input-file',

        methods: {
            onChange(event: Event) {
                this.$emit('change', event);
            }
        }
    })
</script>