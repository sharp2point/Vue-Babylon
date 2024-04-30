import type { GameState } from "@/types/game_types";

export const GAMESIGNALS = {
    NONE: 1,
    RUN: 10,
    WIN: 20,
    GAMEOTHER: 30,
}
export const GAME: GameState = {
    HVK: null,
    Canvas: null,
    Engine: null,
    Gravity: null,
    GameScene: null,
    Camera: null,
    dragBox: {
        up: -7,
        down: -11.5,
        left: -8.5,
        rigth: 8.5
    },
    gameState: GAMESIGNALS.NONE
};

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