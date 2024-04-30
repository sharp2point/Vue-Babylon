import { collideMask, GAME, GAMESIGNALS } from "@/stores/game_state";
import type { GameState } from "@/types/game_types";
import {
    Color3, Color4, DirectionalLight, Engine, HavokPlugin, HemisphericLight,
    Material,
    Mesh, MeshBuilder, PhysicsAggregate, PhysicsMotionType, PhysicsShapeType,
    Scene, ShadowGenerator, StandardMaterial, Tools, TransformNode,
    UniversalCamera, Vector3,
    type IShadowLight
} from "@babylonjs/core";
import { cameraSettings, createFrame } from "./utils";
import { useCameraDebugStore } from "@/stores/camera_debug_store";
import { Ball } from "./objects/ball";
import { Shield } from "./objects/shield";
import { Inspector } from "@babylonjs/inspector";
import { initAllMaterials } from "./materials/all_materials";

export class GameScene {
    private scene: Scene;
    private gameBox = { width: 18, height: 25 };
    private dragBox = {
        up: -7,
        down: -12.0,
        left: -8.5,
        rigth: 8.5
    };
    private camera: UniversalCamera;
    private cameraStore;
    private ball: Ball | null = null;
    private shield: Shield | null = null;
    private allMaterials: Map<string, Material>;

    get gameScene() {
        return this.scene;
    }

    constructor(game_state: GameState) {
        this.cameraStore = useCameraDebugStore();
        this.cameraStore.$subscribe(() => {
            this.camera.position = new Vector3(this.cameraStore.getVecPosition.x, this.cameraStore.getVecPosition.y, this.cameraStore.getVecPosition.z);;
            this.camera.target = new Vector3(this.cameraStore.getVecTarget.x, this.cameraStore.getVecTarget.y, this.cameraStore.getVecTarget.z);

            this.camera.fov = Tools.ToRadians(this.cameraStore.getVecFOV);
        })
        this.scene = new Scene(game_state.Engine as Engine);
        this.scene.enablePhysics(game_state.Gravity, game_state.HVK as HavokPlugin);
        this.scene.clearColor = Color4.FromHexString("#676D5Cff");
        this.scene.ambientColor = new Color3(1, 1, 1);

        this.camera = new UniversalCamera("main-scene-camera", new Vector3(0, 0, 0), this.scene);
        this.camera.position = new Vector3(0, 15, -10);
        this.camera.target = Vector3.Zero();
        this.camera.fov = Tools.ToRadians(80);
        GAME.Camera = this.camera;
        cameraSettings();

        const sceneLight = this.addLight(this.scene);

        this.allMaterials = initAllMaterials(this.scene);
        this.createWorld(this.scene);
        this.dragBoxLines();

        this.shield = new Shield("shield", new Vector3(0, 0, -9), this.scene);

        this.ball = new Ball("ball", this.scene);
        this.appendShadows(sceneLight, this.ball.mesh);
        this.addSceneGameEvents();

        this.scene.onBeforeRenderObservable.add(() => {
            if (this.ball && this.shield) {
                if (!this.ball.isRun) {
                    this.ball.ballJoinShield(this.shield);
                }
            }
        })
        this.scene.onKeyboardObservable.add((info) => {
            switch (info.event.key) {
                case "w": {
                    this.ball!.run();
                    break;
                }
            }
            if (info.event.key === 'i' && info.event.altKey) {
                if (Inspector.IsVisible) {
                    Inspector.Hide();
                } else {
                    Inspector.Show(this.scene, { embedMode: true, });
                }
            }
        });
        GAME.gameState = GAMESIGNALS.RUN;
    }

    changeAmbientColor(color: Color3) {
        this.scene.ambientColor = color;
    }
    changeClearColor(color: Color4) {
        this.scene.clearColor = color;
    }
    addLight(scene: Scene) {
        const hemiEnemyLight = new HemisphericLight("enemy-hemilight", new Vector3(0, 1, -8), scene);
        hemiEnemyLight.diffuse = new Color3(1, 1, 1);
        hemiEnemyLight.specular = new Color3(1, 1, 1);
        hemiEnemyLight.intensity = 1;

        const dirLight = new DirectionalLight("main-scene-dirlight", new Vector3(0, -1, 0), scene);
        dirLight.position = new Vector3(0, 5, 0);
        dirLight.diffuse = new Color3(1, 1, 1);
        dirLight.specular = new Color3(0.2, 0.2, 0.2);
        dirLight.intensity = 0.1;
        return dirLight;
    }
    createWorld(scene: Scene) {
        const world_node = new TransformNode("world-transform-node", scene);
        const ground = MeshBuilder.CreateGround("ground", {
            width: this.gameBox.width,
            height: this.gameBox.height
        }, scene);
        ground.receiveShadows = true;

        const ground_aggregate = new PhysicsAggregate(ground, PhysicsShapeType.CONVEX_HULL, {
            mass: 10000,
            restitution: 0,
            friction: 0.5
        }, scene);
        ground_aggregate.shape.filterCollideMask = collideMask.groups.ground;
        ground_aggregate.shape.filterMembershipMask = collideMask.ground;
        ground_aggregate.body.setMotionType(PhysicsMotionType.STATIC);

        // --------- ROOF -------------->
        const roof = MeshBuilder.CreatePlane("roof", {
            width: this.gameBox.width + 2,
            height: this.gameBox.height + 2,
        }, scene);
        roof.rotation.x = Tools.ToRadians(90);
        roof.position.y = 0.7;

        const roof_aggregate = new PhysicsAggregate(roof, PhysicsShapeType.BOX, {
            mass: 100000, friction: 0, restitution: 0
        }, scene);
        roof_aggregate.body.setMotionType(PhysicsMotionType.STATIC);
        roof_aggregate.shape.filterMembershipMask = collideMask.roof;
        roof_aggregate.shape.filterCollideMask = collideMask.groups.roof;

        const roof2 = MeshBuilder.CreatePlane("roof2", {
            width: this.gameBox.width + 2,
            height: this.gameBox.height + 2,
        }, scene);
        roof2.rotation.x = Tools.ToRadians(90);
        roof2.position.y = 0.9;

        const roof2_aggregate = new PhysicsAggregate(roof, PhysicsShapeType.BOX, {
            mass: 100000, friction: 0, restitution: 0
        }, scene);
        roof2_aggregate.body.setMotionType(PhysicsMotionType.STATIC);
        roof2_aggregate.shape.filterMembershipMask = collideMask.roof;
        roof2_aggregate.shape.filterCollideMask = collideMask.groups.roof;

        //---------- WALLS ------------->

        ground.parent = world_node;

        const wall_coord = [
            new Vector3(-10, -13, 0),
            new Vector3(10, -13, 0),
            new Vector3(10, 13, 0),
            new Vector3(-10, 13, 0),
        ];
        const profilePoints = [
            new Vector3(-0.5, 1.5, 0),
            new Vector3(-0.5, -1.5, 0),
            new Vector3(0.5, -1.5, 0),
            new Vector3(0.5, 0.2, 0),
            new Vector3(0.2, 0.2, 0),
            new Vector3(0.2, 1.5, 0)
        ];
        const walls = createFrame("wall", { path: wall_coord, profile: profilePoints }, this.scene);
        walls.receiveShadows = true;
        walls.rotation.x = Tools.ToRadians(90);
        walls.setParent(world_node);
        const wall_aggregate = new PhysicsAggregate(walls, PhysicsShapeType.MESH, {
            mass: 100000, restitution: 0.5, friction: 0.5
        }, this.scene)
        wall_aggregate.body.setMotionType(PhysicsMotionType.STATIC);
        wall_aggregate.shape.filterMembershipMask = collideMask.ground;
        wall_aggregate.shape.filterCollideMask = collideMask.groups.ground;

        const wall_aggregate2 = new PhysicsAggregate(walls, PhysicsShapeType.MESH, {
            mass: 100000, restitution: 0.5, friction: 0.5
        }, this.scene)
        wall_aggregate2.body.setMotionType(PhysicsMotionType.STATIC);
        wall_aggregate2.shape.filterMembershipMask = collideMask.ground;
        wall_aggregate2.shape.filterCollideMask = collideMask.groups.ground;
        world_node.position.x -= 0.2;
        //--------------------------------------------->  
        ground.receiveShadows = true;
        walls.receiveShadows = true;

        ground.material = this.allMaterials.get('groundMaterial') as StandardMaterial;
        roof.material = this.allMaterials.get('roofMaterial') as StandardMaterial;
        roof2.material = this.allMaterials.get('roofMaterial') as StandardMaterial;
        walls.material = this.allMaterials.get('wallMaterial') as StandardMaterial;

        return world_node;
    }
    dragBoxLines() {
        MeshBuilder.CreateLines("center-line", {
            points: [new Vector3(this.dragBox.left, 0.1, 0),
            new Vector3(0, 0.1, 0),
            new Vector3(this.dragBox.rigth, 0.1, 0)],
            colors: [new Color4(0.5, 0.5, 0.5, 0.3), new Color4(0.5, 0.5, 0.5, 0.3), new Color4(0.5, 0.5, 0.5, 0.3)]
        }, this.scene);
        MeshBuilder.CreateLines("up-line", {
            points: [new Vector3(this.dragBox.left, 0.1, this.dragBox.up),
            new Vector3(0, 0.1, this.dragBox.up),
            new Vector3(this.dragBox.rigth, 0.1, this.dragBox.up)],
            colors: [new Color4(0.3, 0.5, 0.5, 1), new Color4(0.9, 0.5, 0.5, 1), new Color4(0.3, 0.5, 0.5, 1)]
        }, this.scene);
        MeshBuilder.CreateLines("down-line", {
            points: [new Vector3(this.dragBox.left, 0.1, this.dragBox.down),
            new Vector3(0, 0.1, this.dragBox.down),
            new Vector3(this.dragBox.rigth, 0.1, this.dragBox.down)],
            colors: [new Color4(0.3, 0.5, 0.5, 1), new Color4(0.9, 0.5, 0.5, 1), new Color4(0.3, 0.5, 0.5, 1)]
        }, this.scene)
    }
    appendShadows(light: IShadowLight, mesh: Mesh) {
        const shadowGen = new ShadowGenerator(512, light);
        shadowGen.useKernelBlur = true;
        shadowGen.useExponentialShadowMap = true
        shadowGen.addShadowCaster(mesh);
    }
    addSceneGameEvents() {
        this.scene.onPointerDown = () => {
            if (this.shield && this.ball) {
                if (GAME.gameState === GAMESIGNALS.RUN && !this.shield.pointerDown) {
                    const pic = this.scene.pick(this.scene.pointerX, this.scene.pointerY, () => true);
                    this.shield.pointerDown = true;
                    this.shield.position = pic.pickedPoint as Vector3;
                }
            }
        };
        this.scene.onPointerUp = () => {
            if (this.shield && this.ball) {
                if (GAME.gameState === GAMESIGNALS.RUN && this.shield.pointerDown) {
                    this.shield.pointerDown = false;
                    if (!this.ball.isRun) {
                        this.ball.run();
                    }
                }
            }
        }
        this.scene.onPointerMove = () => {
            if (this.shield && this.ball) {
                if (GAME.gameState === GAMESIGNALS.RUN && this.shield.pointerDown) {
                    const pic = this.scene.pick(this.scene.pointerX, this.scene.pointerY, () => true);
                    this.shield.position = pic.pickedPoint as Vector3;
                }
            }
        }
    }
}