<script setup lang="ts">
import { initCore } from '@/game/init'
import { GAME } from '@/stores/game_state'
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import GameCanvas from "@/components/game_controls/GameCanvas.vue"
import levelManager from '@/game/level_manager';
import CameraDebugView from "@/views/CameraDebugView.vue"

const route = useRoute()
const levelId = parseInt(route.params.id[0]);

const width = ref(window.innerWidth)
const height = ref(window.innerHeight)

const isOpenMenu = ref(false);

function onMenuButtonHandler(){
    isOpenMenu.value = !isOpenMenu.value;
}
onMounted(() => {
    initCore().then(() => {
        levelManager(levelId)
    })
})
onUnmounted(() => {
    if (GAME.Engine) {
        GAME.Engine.stopRenderLoop();
    }
})
</script>
<template>
    <GameCanvas id="game" :width="width" :height="height"/>
    <CameraDebugView :isOpen="isOpenMenu"/>
    <button class="menu-button" @click="onMenuButtonHandler">OPEN</button>
</template>

<style scoped>
    #game{
        position: absolute;
        top:0;
        left:0;
        width:100vw;
        height:100vh;
    }
    .menu-button{
        position:absolute;
        top:0;
        left:0;
        width:80px;
        height:30px;
        cursor: pointer;
        z-index: 200;
    }
</style>