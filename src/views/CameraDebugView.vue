<script setup lang="ts">
import { useCameraDebugStore } from '@/stores/camera_debug_store';
import CameraDebugControl from '@/components/debug_control/CameraDebugControl.vue';
import { onUpdated } from 'vue';

const props = defineProps({
    isOpen:Boolean,
})

const cameraStore = useCameraDebugStore();


</script>

<template>
    <div class="container" v-if="isOpen">
        <p class="data-line camera-position"><span class="line-header">pos:</span> <span>{{ cameraStore.getPosition }}</span></p>
        <p class="data-line camera-target"><span class="line-header">target:</span> <span>{{ cameraStore.getTarget }}</span></p>
        <p class="data-line camera-fov"><span class="line-header">FOV:</span> <span>{{ cameraStore.getFOV }}</span></p>
        <CameraDebugControl/>  
    </div>

</template>
<style scoped>
.container{
    position:absolute;
    z-index: 100;
    min-width:250px;
    width:250px;
    min-height:150px;
    padding:1rem;
    display:flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    gap:1rem;
    font-size: 1rem;
    border:1px solid black;
    border-radius: 0.5rem;
    background: rgba(0,0,0,0.1);
    color:white;
}
.data-line{
    width:100%;
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height:30px;
    border-bottom: 1px solid red;
}
.line-header{
    width:50px
}
</style>