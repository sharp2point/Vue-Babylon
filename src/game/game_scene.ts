import { collideMask, GAME } from "@/stores/game_state";
import type { GameState } from "@/types/game_types";
import {
    Color3, Color4, Engine, HavokPlugin, HemisphericLight, MeshBuilder, PhysicsAggregate, PhysicsMotionType, PhysicsShapeType,
    Scene, StandardMaterial, Tools, TransformNode,
    UniversalCamera, Vector3
} from "@babylonjs/core";
import { cameraSettings, createFrame } from "./utils";
import { useCameraDebugStore } from "@/stores/camera_debug_store";
import { Ball } from "./objects/ball";

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

        this.addLight(this.scene);
        this.createWorld(this.scene);
        this.dragBoxLines();

        this.ball = new Ball("ball", this.scene);

        this.scene.onBeforeRenderObservable.add(() => {

        })
        this.scene.onKeyboardObservable.add((info) => {
            switch (info.event.key) {
                case "w": {
                    this.ball!.run();
                    break;
                }
            }
        })
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
    }
    createWorld(scene: Scene) {
        const world_node = new TransformNode("world-transform-node", scene);
        const ground = MeshBuilder.CreateGround("ground", {
            width: this.gameBox.width,
            height: this.gameBox.height
        }, scene);
        ground.receiveShadows = true;
        const ground_mt = new StandardMaterial(`${ground.name}-mt`, scene);
        ground_mt.diffuseColor = Color3.FromHexString("#fefade");
        //Color3.FromHexString("#240935");
        //Color3.FromHexString("#434750");
        //Color3.FromHexString("#474a51");
        //Color3.FromHexString("#6c6874");
        //Color3.FromHexString("#7a7666");
        //Color3.FromHexString("#6c6960"); 
        //new Color3(0.21, 0.19, 0.21);
        ground_mt.maxSimultaneousLights = 10;
        ground.material = ground_mt;

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
            width: this.gameBox.width+2,
            height: this.gameBox.height+2,
        }, scene);
        roof.rotation.x = Tools.ToRadians(90);
        roof.position.y = 0.7;

        const roof_mt = new StandardMaterial("roof-mt", scene);
        roof_mt.diffuseColor = new Color3(0, 0, 0);
        roof_mt.alpha = 0.01;
        roof.material = roof_mt;

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
        roof2.material = roof_mt;

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
        const walls = createFrame("wall", { path: wall_coord, profile: profilePoints }, this.scene)
        walls.rotation.x = Tools.ToRadians(90);
        const wall_mt = new StandardMaterial("wall-mt", scene);
        wall_mt.diffuseColor = Color3.FromHexString("#6c6874");;
        wall_mt.alpha = 1;
        walls.material = wall_mt;
        walls.setParent(world_node);
        const wall_aggregate = new PhysicsAggregate(walls, PhysicsShapeType.MESH, {
            mass: 100000, restitution: 0.5, friction: 0.5
        }, this.scene)
        wall_aggregate.body.setMotionType(PhysicsMotionType.STATIC);
        wall_aggregate.shape.filterMembershipMask = collideMask.ground;
        wall_aggregate.shape.filterCollideMask = collideMask.groups.ground;
        world_node.position.x -= 0.2;
        //--------------------------------------------->  

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
}