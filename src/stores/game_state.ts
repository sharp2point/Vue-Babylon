import type{ GameState } from "@/types/game_types";

export const GAME: GameState = {
    HVK: null,
    Canvas: null,
    Engine: null,
    Gravity: null,
    GameScene: null,
    Camera:null,
};
export const SIGNALS = {
    PRELOAD: false,
    MENU: false,
    GAME_RUN: false,
}
export const collideMask = {
    shield: 0b00000001,
    ball: 0b00000010,
    enemy: 0b00000100,
    enemyParts: 0b00001000,
    rocket: 0b00010000,
    ground: 0b00100000,
    roof: 0b10000000,
    bombParts: 0b01000000,
    groups: {
        shield: 0b00000010,
        ball: 0b10101101,
        enemy: 0b01111110,
        enemyAnimatic: 0b01111010,
        rocket: 0b00000100,
        enemyParts: 0b00100110,
        bombParts: 0b00100100,
        ground: 0b01111111,
        roof: 0b00000010,
    }
}