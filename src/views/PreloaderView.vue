<script setup lang="ts">

import { Preloader } from "@/game/preloader/preloader"
import { ref, onMounted } from "vue"
import { useRouter } from 'vue-router'
import { canvasReset } from '@/game/utils';

let preloaderCanvas = ref(null);
const preloaderPlace = ref(null);

const router = useRouter()

onMounted(() => {
    if (preloaderCanvas.value) { // run preloader
      const canvas = canvasReset(preloaderCanvas);      
      const preloader = new Preloader(canvas);
      preloader.setText("Nice2JAM");
      preloader.animate(0);
    }
});
setTimeout(() => { // run menu
    if (preloaderPlace.value && preloaderCanvas.value) {
      (preloaderPlace.value as HTMLElement).removeChild(preloaderCanvas.value);      
  }
  router.push("/menu");
}, 5000);
</script>

<template>
  <div class="preloader-place" ref="preloaderPlace">
    <canvas id="preloader" ref="preloaderCanvas"></canvas>
  </div>
</template>

<style scoped>
#preloader {
  width: 100vw;
  height: 100vh;
}
</style>
