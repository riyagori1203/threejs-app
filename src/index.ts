import { KeyDisplay } from './utils';
import { CharacterControls } from './characterControls';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import page from 'page';
import { initializeRoutes } from './routes';

initializeRoutes();

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
    map.repeat.set(5, 5);
}

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

// TARGET AREAS
const leaderboardPosition = new THREE.Vector3(0, 0, -5);
const taskAreaPosition = new THREE.Vector3(18, 0, -25);
const triggerDistance = 2;

// PROXIMITY CHECK
function checkProximity(targetPosition: THREE.Vector3, action: () => void) {
    if (!characterControls) return;
    const characterPosition = characterControls.model.position;
    const distance = characterPosition.distanceTo(targetPosition);
    
    if (distance < triggerDistance) {
        action();
    }
}

// POP-UP FUNCTIONALITIES
function openCarbonFootprintPopup() {
    alert("🌍 Task of the Day: Track your Carbon Footprint!");
    setTimeout(() => page('/task'), 20);
}

function redirectToLeaderboardPage() {
    page('/leaderboard');
}

// 🏆 LEADERBOARD (Enhanced)
const leaderboardCanvas = document.createElement('canvas');
const leaderboardCtx = leaderboardCanvas.getContext('2d')!;
leaderboardCanvas.width = 512;
leaderboardCanvas.height = 256;

function updateLeaderboardTexture() {
    leaderboardCtx.clearRect(0, 0, leaderboardCanvas.width, leaderboardCanvas.height);

    const gradient = leaderboardCtx.createLinearGradient(0, 0, 0, leaderboardCanvas.height);
    gradient.addColorStop(0, "#3b3b3b"); // Dark Gray
    gradient.addColorStop(1, "#1a1a1a"); // Almost Black
    
    leaderboardCtx.fillStyle = gradient;
    leaderboardCtx.fillRect(0, 0, leaderboardCanvas.width, leaderboardCanvas.height);

    leaderboardCtx.strokeStyle = "gold";
    leaderboardCtx.lineWidth = 6;
    leaderboardCtx.strokeRect(0, 0, leaderboardCanvas.width, leaderboardCanvas.height);

    leaderboardCtx.fillStyle = "white";
    leaderboardCtx.font = "bold 40px Arial";
    leaderboardCtx.fillText("🏆 Leaderboard", 140, 50);

    leaderboardCtx.font = "28px Arial";
    leaderboardCtx.fillStyle = "#FFD700";
    leaderboardCtx.fillText("1. Player1: 100", 140, 120);

    leaderboardCtx.fillStyle = "#C0C0C0";
    leaderboardCtx.fillText("2. Player2: 80", 140, 160);

    leaderboardCtx.fillStyle = "#CD7F32";
    leaderboardCtx.fillText("3. Player3: 60", 140, 200);

    leaderboardTexture.needsUpdate = true;
}

const leaderboardTexture = new THREE.CanvasTexture(leaderboardCanvas);
const leaderboardMaterial = new THREE.MeshBasicMaterial({ map: leaderboardTexture, side: THREE.DoubleSide });

const leaderboardGeometry = new THREE.PlaneGeometry(5, 2.5);
const leaderboard = new THREE.Mesh(leaderboardGeometry, leaderboardMaterial);
leaderboard.position.set(0, 3, -5);
leaderboard.rotation.x = -0.1;

scene.add(leaderboard);
updateLeaderboardTexture();

// 🌍 TASK OF THE DAY (Enhanced)
const taskCanvas = document.createElement('canvas');
const taskCtx = taskCanvas.getContext('2d')!;
taskCanvas.width = 512;
taskCanvas.height = 256;

function updateTaskTexture() {
    taskCtx.clearRect(0, 0, taskCanvas.width, taskCanvas.height);

    // Gradient background (same as leaderboard)
    const gradient = taskCtx.createLinearGradient(0, 0, 0, taskCanvas.height);
    gradient.addColorStop(0, "#3b3b3b"); // Dark Gray
    gradient.addColorStop(1, "#1a1a1a"); // Almost Black
    
    taskCtx.fillStyle = gradient;
    taskCtx.fillRect(0, 0, taskCanvas.width, taskCanvas.height);

    // Gold border
    taskCtx.strokeStyle = "gold";
    taskCtx.lineWidth = 6;
    taskCtx.strokeRect(0, 0, taskCanvas.width, taskCanvas.height);

    // Text & Formatting
    taskCtx.fillStyle = "white";
    taskCtx.font = "bold 40px Arial";
    taskCtx.fillText("🌍 Task of the Day", 100, 50);

    taskCtx.font = "28px Arial";
    taskCtx.fillStyle = "#FFD700";
    taskCtx.fillText("🌱 Track your Carbon Footprint", 50, 120);
    
    taskCtx.fillStyle = "#C0C0C0";
    taskCtx.fillText("📉 Reduce your impact!", 80, 160);

    taskTexture.needsUpdate = true;
}

const taskTexture = new THREE.CanvasTexture(taskCanvas);
const taskMaterial = new THREE.MeshBasicMaterial({ map: taskTexture, side: THREE.DoubleSide });

const taskGeometry = new THREE.PlaneGeometry(5, 2.5);
const taskBoard = new THREE.Mesh(taskGeometry, taskMaterial);
taskBoard.position.set(18, 3, -25);
taskBoard.rotation.x = -0.1;

scene.add(taskBoard);
updateTaskTexture();

// 🔄 AUTO ORIENT TASK BOARD & LEADERBOARD TO FACE CAMERA
function updateBoardsPosition() {
    leaderboard.lookAt(camera.position);
    taskBoard.lookAt(camera.position);
}

// 🎮 CONTROL KEYS & MOVEMENT HANDLING
const keysPressed: { [key: string]: boolean } = {};
const keyDisplayQueue = new KeyDisplay();

document.addEventListener('keydown', (event) => {
    keyDisplayQueue.down(event.key);
    if (event.shiftKey && characterControls) characterControls.switchRunToggle();
    else keysPressed[event.key.toLowerCase()] = true;
}, false);

document.addEventListener('keyup', (event) => {
    keyDisplayQueue.up(event.key);
    keysPressed[event.key.toLowerCase()] = false;
}, false);

// 🔄 ANIMATE FUNCTION (Handles Character Movement & Board Rotation)
const clock = new THREE.Clock();

function animate() {
    let mixerUpdateDelta = clock.getDelta();
    if (characterControls) {
        characterControls.update(mixerUpdateDelta, keysPressed);
        checkProximity(leaderboardPosition, redirectToLeaderboardPage);
        checkProximity(taskAreaPosition, openCarbonFootprintPopup);
        checkProximity(rewardsAreaPosition, openRewardsBoard); // NEW 
    }
    orbitControls.update();
    updateBoardsPosition();
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();
// 🎁 REWARDS BOARD (Enhanced)
const rewardsCanvas = document.createElement('canvas');
const rewardsCtx = rewardsCanvas.getContext('2d')!;
rewardsCanvas.width = 512;
rewardsCanvas.height = 256;

leaderboardCanvas.width = 512;
leaderboardCanvas.height = 256;

function updateRewardsTexture() {
    rewardsCtx.clearRect(0, 0, rewardsCanvas.width, rewardsCanvas.height);

    // Create gradient background
    const gradient = rewardsCtx.createLinearGradient(0, 0, 0, rewardsCanvas.height);
    gradient.addColorStop(0, "#3b3b3b"); // Dark Gray
    gradient.addColorStop(1, "#1a1a1a"); // Almost Black
    
    rewardsCtx.fillStyle = gradient;
    rewardsCtx.fillRect(0, 0, rewardsCanvas.width, rewardsCanvas.height);

    // Add gold border
    rewardsCtx.strokeStyle = "gold";
    rewardsCtx.lineWidth = 6;
    rewardsCtx.strokeRect(0, 0, rewardsCanvas.width, rewardsCanvas.height);

    // Add text content
    rewardsCtx.fillStyle = "white";
    rewardsCtx.font = "bold 40px Arial";
    rewardsCtx.fillText("🎁 Rewards Board", 100, 50);

    rewardsCtx.font = "28px Arial";
    rewardsCtx.fillStyle = "#FFD700";
    rewardsCtx.fillText("1. Gift Card: 50 points", 80, 120);

    rewardsCtx.fillStyle = "#C0C0C0";
    rewardsCtx.fillText("2. Discount Code: 30 points", 80, 160);

    rewardsCtx.fillStyle = "#CD7F32";
    rewardsCtx.fillText("3. Badge: 20 points", 80, 200);

    // Mark the rewards texture as needing an update
    rewardsTexture.needsUpdate = true;
}


const rewardsTexture = new THREE.CanvasTexture(rewardsCanvas);
const rewardsMaterial = new THREE.MeshBasicMaterial({ map: rewardsTexture, side: THREE.DoubleSide });

const rewardsGeometry = new THREE.PlaneGeometry(5, 2.5);
const rewardsBoard = new THREE.Mesh(rewardsGeometry, rewardsMaterial);
rewardsBoard.position.set(0, 3, -15); // Adjusted position
rewardsBoard.rotation.x = -0.1;

scene.add(rewardsBoard);
updateRewardsTexture();

// 🔄 AUTO ORIENT REWARDS BOARD TO FACE CAMERA
function updateRewardsPosition() {
    rewardsBoard.lookAt(camera.position);
    
}

// You can call `checkProximity` for the rewards area if needed
const rewardsAreaPosition = new THREE.Vector3(0, 0, -15); // Must match rewardsBoard.position
function openRewardsBoard() {
    alert("🎁 Check your Rewards!");
    setTimeout(() => page('/rewards'), 20);
}

// Update the animate function to check proximity to the rewards board

animate();

// 🌍 WINDOW RESIZE HANDLING
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
