import { Color3, Color4 } from "@babylonjs/core";
import { defineStore } from "pinia";

export const useSceneColorsStore = defineStore('sceneColors', {
    state: () => ({
        sceneAmbientColor: new Color3(1, 0.1, 1),
        sceneClearColor: new Color4(0.05, 0.04, 0.06, 1),
    }),
    getters: {
        ambientColor: (state) => state.sceneAmbientColor,
        clearColor: (state) => state.sceneClearColor,
    },
    actions: {
        setSceneAmbientColor(color: Color3) {
            this.sceneAmbientColor = color;
        },
        setSceneClearColor(color: Color4) {
            this.sceneClearColor = color;
        }
    }
})