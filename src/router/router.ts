import { createWebHistory, createRouter } from "vue-router"

import MainMenuView from '../views/MainMenuView.vue'
import PreloaderView from '../views/PreloaderView.vue'
import GameLevelView from '../views/GameLevelView.vue'

const routes = [
    { path: '/', component: PreloaderView },
    { path: '/menu', component: MainMenuView },
    { path: '/level/:id', component: GameLevelView },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router