import { GAME } from "@/stores/game_state";
import { GameScene } from "./game_scene";

function levelManager(levelId: number) {
    console.log("level: ", levelId);
    const game_scene = new GameScene(GAME);
    if (GAME.Engine) {
        GAME.Engine.runRenderLoop(() => {
            game_scene.gameScene.render()
        })
    }
}

export default levelManager;