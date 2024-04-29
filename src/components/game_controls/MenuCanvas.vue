<script setup lang="ts">
import { onMounted, onUpdated, ref } from 'vue';
import { ParticlesEffect } from "@/game/particle_effect";


defineProps({
    width: Number,
    height:Number,
});

let particle: ParticlesEffect;

const emit = defineEmits<{
    (emit:"onCanvasCreate",canvas:HTMLCanvasElement):HTMLCanvasElement,
}>();

const canvas = ref(null);
onMounted(() => {   
    if (canvas.value) {
        emit("onCanvasCreate", canvas.value)
        particle = new ParticlesEffect(canvas.value);
        particle.animate(0);
    }
})
onUpdated(() => {
    if (particle) {
        particle.resize();
    } 
})
</script>

<template>
    <canvas :width="$props.width" :height="$props.height" ref="canvas"></canvas>
</template>

<style scoped>
    canvas{
        background: transparent;
    }
</style>