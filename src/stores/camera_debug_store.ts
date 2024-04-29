import { Vector3 } from "@babylonjs/core";
import { defineStore } from "pinia";

export const useCameraDebugStore = defineStore("cameraDebug", {
    state: () => ({
        position: new Vector3(0, 15, -10),
        target: new Vector3(0, -4.75, 0),
        FOV: 73
    }),
    getters: {
        getVecPosition: (state) => state.position,
        getVecTarget: (state) => state.target,
        getVecFOV: (state) => state.FOV,
        getPosition: (state) => {
            return {
                x: state.position.x,
                y: state.position.y,
                z: state.position.z,
            }
        },
        getTarget: (state) => {
            return {
                x: state.target.x,
                y: state.target.y,
                z: state.target.z,
            }
        },
        getFOV: (state) => state.FOV,
    },
    actions: {
        setPosition(vec: Vector3) {
            this.position = vec;
        },
        setTarget(vec: Vector3) {
            this.target = vec;
        },
        setPositionZ(val: number) {
            this.position.z = val;
        },
        setPositionY(val: number) {
            this.position.y = val;
        },
        setTargetZ(val: number) {
            this.target.z = val;
        },
        setTargetY(val: number) {
            this.target.y = val;
        },
        setFOV(angle: number) {
            this.FOV = angle;
        }
    }
});