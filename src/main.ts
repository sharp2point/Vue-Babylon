import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from "./router/router"

import Game from './Game.vue'
import { GAME } from './stores/game_state'
import { cameraSettings, getScreenAspect } from './game/utils'

const app = createApp(Game);

app.use(createPinia())
app.use(router)

app.mount('#app')

window.addEventListener("resize", () => {
    if (GAME.Engine) {
        GAME.Engine.resize();
        cameraSettings();
    }

})
