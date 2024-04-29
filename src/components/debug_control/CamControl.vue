<script setup lang="ts">

const props = defineProps({
    id: String,
    title: String,
    step: String,
    min: String,
    max: String,
    value: Number,
});

const emit = defineEmits<{
    (e:'range',payload: {value:number,id:string}):void,
}>();
function onSlideEvent(e) {
    if (e.target) {
        emit('range', { value: e.target.value, id: props.id as string });
    }
}
    
</script>

<template>
    <fieldset class="position-control">
        <legend>{{$props.title}}: <span class="legend-value">{{ $props.value }}</span> </legend>
        <input type="range" :max="max" :min="min" :step="$props.step" :value="value" @input="e=>onSlideEvent(e)"/>
    </fieldset>
</template>

<style scoped>
.position-control{
    width:100%;
    display: flex;
    flex-direction: column;
}
.legend-value{
    color: bisque;
    font-size: 1.3rem;
    line-height: 1.9rem;
    border:none;
    border-radius: 5px;
    background-color: rgba(0, 0, 0,0.5);
    padding: 0.3rem;
    min-width:30px;
}
</style>