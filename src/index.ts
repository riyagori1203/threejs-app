import { KeyDisplay } from './utils';
import { CharacterControls } from './characterControls';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import page from 'page';
import { initializeRoutes } from './routes';
initializeRoutes();

// import initRoutes from './routes';

// initRoutes();


// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa8def0);

// CAMERA
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 5);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// CONTROLS
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.minDistance = 5;
orbitControls.maxDistance = 15;
orbitControls.enablePan = false;
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
orbitControls.update();

// LIGHTS
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(-60, 100, -10);
dirLight.castShadow = true;
scene.add(dirLight);

// FLOOR
generateFloor();

// CHARACTER CONTROLS
var characterControls: CharacterControls;
new GLTFLoader().load('models/RobotExpressive.glb', function (gltf) {
    const model = gltf.scene;
    model.traverse(function (object: any) {
        if (object.isMesh) object.castShadow = true;
    });
    scene.add(model);

    const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
    const mixer = new THREE.AnimationMixer(model);
    const animationsMap: Map<string, THREE.AnimationAction> = new Map();
    gltfAnimations.filter(a => a.name != 'TPose').forEach((a: THREE.AnimationClip) => {
        animationsMap.set(a.name, mixer.clipAction(a));
    });

    characterControls = new CharacterControls(model, mixer, animationsMap, orbitControls, camera, 'Idle');
});

// TARGET AREAS (Leaderboard & Task of the Day)
const leaderboardPosition = new THREE.Vector3(0, 0, -5);
const taskAreaPosition = new THREE.Vector3(18, 0, -25); // Position of the task area
const triggerDistance = 2; // Distance threshold to trigger actions

// GENERALIZED PROXIMITY CHECK
function checkProximity(targetPosition: THREE.Vector3, action: () => void) {
    if (!characterControls) return;
    const characterPosition = characterControls.model.position;
    const distance = characterPosition.distanceTo(targetPosition);
    
    // Debugging logs to track proximity and distance
    console.log(`Character Position: ${characterPosition}, Target Position: ${targetPosition}, Distance: ${distance}`);
    
    if (distance < triggerDistance) {
        action();
    }
}

// OPEN CARBON FOOTPRINT POP-UP
function openCarbonFootprintPopup() {
    console.log("Opening Carbon Footprint Popup!");
    alert("🌍 Task of the Day: Track your Carbon Footprint!");
    setTimeout(() => {
        page('/task');  // Navigate using page.js after showing the popup
    }, 20);
}

// REDIRECT TO LEADERBOARD PAGE

function redirectToLeaderboardPage() {
    page('/leaderboard');
}

// LEADERBOARD (3D Textured Canvas)
const leaderboardCanvas = document.createElement('canvas');
const leaderboardCtx = leaderboardCanvas.getContext('2d')!;
leaderboardCanvas.width = 512;
leaderboardCanvas.height = 256;

function updateLeaderboardTexture() {
    leaderboardCtx.clearRect(0, 0, leaderboardCanvas.width, leaderboardCanvas.height);
    leaderboardCtx.fillStyle = "black";
    leaderboardCtx.fillRect(0, 0, leaderboardCanvas.width, leaderboardCanvas.height);
    leaderboardCtx.fillStyle = "white";
    leaderboardCtx.font = "30px Arial";
    leaderboardCtx.fillText("Leaderboard", 180, 50);
    leaderboardCtx.font = "24px Arial";
    leaderboardCtx.fillText("1. Player1: 100", 150, 100);
    leaderboardCtx.fillText("2. Player2: 80", 150, 140);
    leaderboardCtx.fillText("3. Player3: 60", 150, 180);
    leaderboardTexture.needsUpdate = true;
}

const leaderboardTexture = new THREE.CanvasTexture(leaderboardCanvas);
const leaderboardMaterial = new THREE.MeshBasicMaterial({ map: leaderboardTexture, side: THREE.DoubleSide });

const leaderboardGeometry = new THREE.PlaneGeometry(5, 2.5);
const leaderboard = new THREE.Mesh(leaderboardGeometry, leaderboardMaterial);
leaderboard.position.set(0, 3, -5);
scene.add(leaderboard);
updateLeaderboardTexture();

function updateLeaderboardPosition() {
    leaderboard.lookAt(camera.position);
}

// TASK OF THE DAY (3D Textured Canvas)
const taskCanvas = document.createElement('canvas');
const taskCtx = taskCanvas.getContext('2d')!;
taskCanvas.width = 512;
taskCanvas.height = 256;

function updateTaskTexture() {
    taskCtx.clearRect(0, 0, taskCanvas.width, taskCanvas.height);
    taskCtx.fillStyle = "black";
    taskCtx.fillRect(0, 0, taskCanvas.width, taskCanvas.height);
    taskCtx.fillStyle = "white";
    taskCtx.font = "30px Arial";
    taskCtx.fillText("Task of the Day", 130, 50);
    taskCtx.font = "24px Arial";
    taskCtx.fillText("🌍 Track your Carbon Footprint", 50, 100);
    taskCtx.fillText("and reduce your impact!", 50, 140);
    taskTexture.needsUpdate = true;
}

const taskTexture = new THREE.CanvasTexture(taskCanvas);
const taskMaterial = new THREE.MeshBasicMaterial({ map: taskTexture, side: THREE.DoubleSide });

const taskGeometry = new THREE.PlaneGeometry(5, 2.5);
const taskBoard = new THREE.Mesh(taskGeometry, taskMaterial);
taskBoard.position.set(18, 3, -25);  // Adjust Z-axis to move it further from the leaderboard
scene.add(taskBoard);
updateTaskTexture();

function updateTaskPosition() {
    taskBoard.lookAt(camera.position);
}

// CONTROL KEYS
const keysPressed: { [key: string]: boolean } = {};
const keyDisplayQueue = new KeyDisplay();

document.addEventListener('keydown', (event) => {
    keyDisplayQueue.down(event.key);
    if (event.shiftKey && characterControls) {
        characterControls.switchRunToggle();
    } else {
        keysPressed[event.key.toLowerCase()] = true;
    }
}, false);

document.addEventListener('keyup', (event) => {
    keyDisplayQueue.up(event.key);
    keysPressed[event.key.toLowerCase()] = false;
}, false);

// ANIMATE
const clock = new THREE.Clock();

function animate() {
    let mixerUpdateDelta = clock.getDelta();
    if (characterControls) {
        characterControls.update(mixerUpdateDelta, keysPressed);
        checkProximity(leaderboardPosition, redirectToLeaderboardPage);  // Check for leaderboard proximity
        checkProximity(taskAreaPosition, openCarbonFootprintPopup);  // Check for Task of the Day proximity
    }
    orbitControls.update();
    updateLeaderboardPosition();
    updateTaskPosition(); // Update task board position
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

// RESIZE HANDLER
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    keyDisplayQueue.updatePosition();
}
window.addEventListener('resize', onWindowResize);

// FLOOR GENERATION
function generateFloor() {
    const textureLoader = new THREE.TextureLoader();
    const greenGrass = textureLoader.load("./textures/sand/greengrass.jpg");
    const sandHeightMap = textureLoader.load("./textures/sand/Sand 002_DISP.jpg");
    const sandAmbientOcclusion = textureLoader.load("./textures/sand/Sand 002_OCC.jpg");

    const WIDTH = 80;
    const LENGTH = 80;
    const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);
    const material = new THREE.MeshStandardMaterial({
        map: greenGrass,
        normalMap: greenGrass,
        displacementMap: sandHeightMap,
        displacementScale: 0.1,
        aoMap: sandAmbientOcclusion
    });

    wrapAndRepeatTexture(material.map);
    wrapAndRepeatTexture(material.normalMap);
    wrapAndRepeatTexture(material.displacementMap);
    wrapAndRepeatTexture(material.aoMap);

    const floor = new THREE.Mesh(geometry, material);
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
}

function wrapAndRepeatTexture(map: THREE.Texture) {
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.x = map.repeat.y = 5;
}

