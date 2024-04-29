<script setup lang="ts">
import { ref } from "vue";
defineProps({
    width:Number,
    height:Number    
})
    
</script>

<template>
    <canvas :width="$props.width" :height="$props.height"  allow="fullscreen"></canvas>
</template>


