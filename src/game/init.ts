import { GAME } from "@/stores/game_state";
import { Engine, HavokPlugin, Vector3 } from "@babylonjs/core";
import * as havok from "@babylonjs/havok?init";

async function initCore() {
    const physics = await havok.default();
    GAME.HVK = new HavokPlugin(true, physics);
    GAME.Canvas = document.querySelector('#game');
    GAME.Engine = new Engine(GAME.Canvas, true, { xrCompatible: false }, true);
    GAME.Gravity = new Vector3(0, -9.81, 0);
}

export {initCore};