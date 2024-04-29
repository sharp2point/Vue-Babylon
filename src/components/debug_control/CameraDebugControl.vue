<script setup lang="ts">
import CamControl from '@/components/debug_control/CamControl.vue';
import { useCameraDebugStore } from '@/stores/camera_debug_store';

const cameraStore = useCameraDebugStore();

function onRange(e: {id:string, value:number}) {
    const val = `${e.value}`;

    switch(e.id){
        case "pos-z": {
            cameraStore.setPositionZ(parseInt(val))
            break;
        }
        case "pos-y": {
            cameraStore.setPositionY(parseInt(val))
            break;
        }
        case "trg-z": {
            cameraStore.setTargetZ(parseInt(val))
            break;
        }
        case "trg-y": {
            cameraStore.setTargetY(parseInt(val))
            break;
        }
        case "fov": {
            cameraStore.setFOV(parseInt(val))
            break;
        }
    }
}
</script>

<template>
    <div class="control-container">
        <CamControl title="PositionZ" id="pos-z" @range="e=>onRange(e)" min="-30.5" max="0.5" step="0.25" :value="cameraStore.getPosition.z"/>
        <CamControl title="PositionY" id="pos-y" @range="e => onRange(e)" min="0" max="35" step="0.25" :value="cameraStore.getPosition.y"/>
        <CamControl title="TargetZ" id="trg-z" @range="e => onRange(e)" min="-9" max="15" step="0.25" :value="cameraStore.getTarget.z"/>
        <CamControl title="TargetY" id="trg-y" @range="e => onRange(e)" min="-30" max="15"  step="0.25" :value="cameraStore.getTarget.y"/>
        <CamControl title="FOV" id="fov" @range="e => onRange(e)" min="40" max="150" step="1" :value="cameraStore.getFOV"/>
    </div>
</template>

<style scoped>
.control-container{
    position:relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin:1rem;
    padding:1rem;
    background-color: rgba(0,0,0,0.1);
    border:1px solid black;
    border-radius: 0.4rem;
    gap:1rem;
}
</style>