import type { Engine, HavokPlugin, Scene, UniversalCamera, Vector3 } from "@babylonjs/core";

export type GameState = {
    HVK: HavokPlugin | null,
    Canvas: HTMLCanvasElement | null,
    Engine: Engine | null,
    Gravity: Vector3 | null,
    GameScene: Scene | null,
    Camera: UniversalCamera | null
}