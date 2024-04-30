import { collideMask, GAME, GAMESIGNALS } from "@/stores/game_state";
import {
    HavokPlugin, Mesh, MeshBuilder, Observer, PhysicsAggregate,
    PhysicsMotionType, PhysicsShapeType,
    Quaternion,
    Scene, setAndStartTimer, Vector3
} from "@babylonjs/core";
import type { Shield } from "./shield";


export class Ball {
    private scene: Scene;
    private _isRun = false;
    private radius = 0.3;
    private ball: Mesh;
    private aggregate: PhysicsAggregate | null = null;
    private physics = {
        mass: 10,
        friction: 0.1,
        restitution: 0.5
    }
    private speedLimits = {
        max: 50,
        min: 10,
    }
    private initPosition = new Vector3(0, 0.35, -5.5);
    private initImpulse = new Vector3(0, 0, 1000);
    private initSpeed = new Vector3(0, 0, 500);
    private ballRunObserver: Observer<Mesh> | null = null;

    get mesh() {
        return this.ball;
    }
    get isRun() {
        return this._isRun;
    }
    get body() {
        return this.aggregate!.body;
    }
    get position() {
        return this.ball.position.clone();
    }
    set position(val: Vector3) {
        this.ball.position = val;
    }

    constructor(name: string, scene: Scene) {
        this.scene = scene;
        this.ball = MeshBuilder.CreateSphere(name, { diameter: this.radius * 2,segments:8 }, scene);
        this.ball.position = this.initPosition;
        this.ball.receiveShadows = true;
        this.appendPhysics();
    }
    private appendPhysics() {
        this.aggregate = new PhysicsAggregate(this.ball, PhysicsShapeType.SPHERE, this.physics, this.scene);
        this.aggregate.body.setMotionType(PhysicsMotionType.ANIMATED);
        this.aggregate.shape.filterMembershipMask = collideMask.ball;
        this.aggregate.shape.filterCollideMask = 0;
        this.aggregate.body.setCollisionCallbackEnabled(true);
        this.aggregate.body.setCollisionEndedCallbackEnabled(true);
    }
    reset() {
        this._isRun = false;
        if (this.aggregate) {
            (GAME.HVK as HavokPlugin).removeBody(this.aggregate.body);
        }
        if (this.ballRunObserver) {
            this.ball.onBeforeDrawObservable.remove(this.ballRunObserver);
        }
        this.ball.position = this.initPosition;
        this.appendPhysics();
    }
    run() {
        this._isRun = true;
        setAndStartTimer({
            timeout: 200,
            contextObservable: this.scene.onBeforeRenderObservable,
            onEnded: () => {
                if (this.aggregate) {
                    this.aggregate.body.setMotionType(PhysicsMotionType.DYNAMIC);
                    this.aggregate.shape.filterCollideMask = collideMask.groups.ball;
                    this.aggregate.body.setAngularVelocity(new Vector3(0, 100000, 0))
                    this.aggregate.body.applyImpulse(this.initImpulse, this.ball.position);
                    this.aggregate.body.applyForce(this.initSpeed, this.ball.position);
                }
                this.ballRunObserver = this.ball.onBeforeRenderObservable.add(() => this.onRunObserver());
            }
        });
    }
    velocityControl() {
        if (this.aggregate) {
            const length = this.aggregate.body.getLinearVelocity().length();
            if (length < this.speedLimits.min) {
                this.aggregate.body.applyImpulse((this.aggregate.body.getLinearVelocity().multiply(new Vector3(1.1, 0, 1.1))), this.ball.getAbsolutePosition());
            } else if (length > this.speedLimits.max) {
                this.aggregate.body.setLinearVelocity(this.aggregate.body.getLinearVelocity().multiply(new Vector3(0.75, 0, 0.75)));
            }
        }

    }
    clearBallVelocityY() {
        if (this.aggregate) {
            this.aggregate.body.setLinearVelocity(this.aggregate.body.getLinearVelocity().clone().multiply(new Vector3(1, 0, 1)))
        }
    }
    ballJoinShield(shield: Shield) {
        if (this.aggregate) {
           this.aggregate.body.setTargetTransform(shield.position.add(new Vector3(0, 0.0, 0.5)), Quaternion.Identity()); 
        }
    }
    private onRunObserver() {
        if (GAME.gameState=== GAMESIGNALS.RUN && this._isRun) {
            this.velocityControl();
            this.clearBallVelocityY();
            // if (this.ball.position.z < GameState.state.dragBox.down) {
            //     if (GameState.state.gameState !== GameState.state.signals.GAME_OTHER_BALL) {
            //         GameState.changeGameState(GameState.state.signals.GAME_OTHER_BALL);
            //     }
            // }
        }
    }
}