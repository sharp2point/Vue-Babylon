import { GAME } from "@/stores/game_state";
import { Mesh, MeshBuilder, Scene, Tools, Vector3, type UniversalCamera } from "@babylonjs/core";
import type { Ref } from "vue";
import { useCameraDebugStore } from '@/stores/camera_debug_store';

function canvasReset(canvas_ref: Ref): HTMLCanvasElement {
    const canvas = canvas_ref.value as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.background = "rgb(0,0,0)";
    return canvas;
}
function canvasCreate(options: { width: number, height: number }): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = options.width;
    canvas.height = options.height;
    return canvas;
}
function cameraSettings() {
    const cameraStore = useCameraDebugStore();
    const aspect = getScreenAspect()
    console.log("AP: ", aspect.toFixed(2));
    let position = cameraStore.getVecPosition;
    let target = cameraStore.getVecTarget;
    let FOV = Tools.ToRadians(cameraStore.getFOV);

    if (aspect < 0.5) {
        position = new Vector3(0, 14.0, 0);
        target = new Vector3(0, -1, 8);
        FOV = Tools.ToRadians(139);

    } else if (aspect >= 0.5 && aspect < 0.6) {
        position = new Vector3(0, 14.0, 0);
        target = new Vector3(0, -4, 8);
        FOV = Tools.ToRadians(131);

    } else if (aspect >= 0.6 && aspect <= 1.1) {
        position = new Vector3(0, 16.0, -4);
        target = new Vector3(0, -16, 8);
        FOV = Tools.ToRadians(96);

    } else if (aspect > 1.1) {
        position = new Vector3(0, 15.0, -16);
        target = new Vector3(0, -11, 9);
        FOV = Tools.ToRadians(61);
    }
    cameraStore.setPosition(position);
    cameraStore.setTarget(target);
    cameraStore.setFOV(Tools.ToDegrees(FOV));
}
function getScreenAspect() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return width / height;
}
function createFrame(name: string, options: { path: Array<Vector3>, profile: Array<Vector3> }, scene: Scene) {
    const path = options.path;
    const profile = options.profile;

    let originX = Number.MAX_VALUE;

    for (let m = 0; m < profile.length; m++) {
        originX = Math.min(originX, profile[m].x);
    }

    let angle = 0;
    let width = 0;
    const cornerProfile = [];

    const nbPoints = path.length;
    let line = Vector3.Zero();
    const nextLine = Vector3.Zero();
    path[1].subtractToRef(path[0], line);
    path[2].subtractToRef(path[1], nextLine);

    for (let p = 0; p < nbPoints; p++) {
        angle = Math.PI - Math.acos(Vector3.Dot(line, nextLine) / (line.length() * nextLine.length()));
        const direction = Vector3.Cross(line, nextLine).normalize().z;
        const lineNormal = new Vector3(line.y, -1 * line.x, 0).normalize();
        line.normalize();
        const extrusionLength = line.length();
        cornerProfile[(p + 1) % nbPoints] = [];
        //local profile
        for (let m = 0; m < profile.length; m++) {
            width = profile[m].x - originX;
            cornerProfile[(p + 1) % nbPoints].push(
                path[(p + 1) % nbPoints]
                    .subtract(
                        lineNormal
                            .scale(width))
                    .subtract(
                        line
                            .scale(direction * width / Math.tan(angle / 2))
                    )
            );
        }

        line = nextLine.clone();
        path[(p + 3) % nbPoints].subtractToRef(path[(p + 2) % nbPoints], nextLine);
    }

    const frame = [];
    const extrusionPaths = []

    for (let p = 0; p < nbPoints; p++) {
        const extrusionPaths = [];
        for (let m = 0; m < profile.length; m++) {
            extrusionPaths[m] = [];
            extrusionPaths[m].push(new Vector3(cornerProfile[p][m].x, cornerProfile[p][m].y, profile[m].y));
            extrusionPaths[m].push(new Vector3(cornerProfile[(p + 1) % nbPoints][m].x, cornerProfile[(p + 1) % nbPoints][m].y, profile[m].y));
        }

        frame[p] = MeshBuilder.CreateRibbon("frameLeft", { pathArray: extrusionPaths, sideOrientation: Mesh.DOUBLESIDE, updatable: true, closeArray: true }, scene);
    }

    return Mesh.MergeMeshes(frame, true).convertToFlatShadedMesh();
}
export { canvasReset, canvasCreate, getScreenAspect, cameraSettings, createFrame };