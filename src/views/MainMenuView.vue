<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import LiquidButton from "@/components/game_controls/LiquidButton.vue";

import MenuCanvas from "@/components/game_controls/MenuCanvas.vue";

const width = ref(window.innerWidth);
const height = ref(window.innerHeight);
const menu = ref(null);

const router = useRouter();
function onPlayButtonHandler() {
    router.push(`/level/${1}`)
}
window.addEventListener("resize", () => {
    if (menu.value) {
       width.value = (menu.value as HTMLElement).clientWidth;
       height.value = (menu.value as HTMLElement).clientHeight;
    }
})
</script>

<template>    
    <div class="main-menu" ref="menu">   
        <MenuCanvas id="menu-canvas" :width="width" :height="height"/>
        <header>
            <h1>BallWall</h1>
            <span>arcanoid</span>
        </header>
        <LiquidButton @click="onPlayButtonHandler" class="play-button" content-button="Run" />
    </div>
</template>

<style scoped>
.main-menu{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: rgb(103, 109, 92);
}
#menu-canvas{
    position: absolute;
    top:0;
    left:0;
}
header{
    width:100%;
    height:300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color:white; 
    z-index: 100;   
}
header h1{
    font:6rem "Impact";
    text-shadow: 3px 3px rgba(30,30,30);
}
header span{
    color:#cdc5c2;
    font:1.8rem "Impact";
    letter-spacing: 0.9rem;
}
@media screen and (max-width: 430px) {
    header h1{
        font-size:4.5rem;
    }
    header span{
        font-size:1.3rem;
        letter-spacing: 0.7rem;
    }
}
/* @media screen and (max-width: 430px) {
    header h1{
        font-size:4rem;
    }
    header span{
        font-size:1.3rem;
        letter-spacing: 0.9rem;
    }
} */
</style>