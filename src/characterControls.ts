import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { A, D, DIRECTIONS, S, W } from './utils'


export class CharacterControls {

    model: THREE.Group
    mixer: THREE.AnimationMixer
    animationsMap: Map<string, THREE.AnimationAction> = new Map() // Walk, Run, Idle
    orbitControl: OrbitControls
    camera: THREE.Camera

    // state
    toggleRun: boolean = true
    currentAction: string
    
    // temporary data
    walkDirection = new THREE.Vector3()
    rotateAngle = new THREE.Vector3(0, 1, 0)
    rotateQuarternion: THREE.Quaternion = new THREE.Quaternion()
    cameraTarget = new THREE.Vector3()
    
    // constants
    fadeDuration: number = 0.2
    runVelocity = 5
    walkVelocity = 2

    constructor(model: THREE.Group,
        mixer: THREE.AnimationMixer, animationsMap: Map<string, THREE.AnimationAction>,
        orbitControl: OrbitControls, camera: THREE.Camera,
        currentAction: string) {
        this.model = model
        this.mixer = mixer
        this.animationsMap = animationsMap
        this.currentAction = currentAction
        this.animationsMap.forEach((value, key) => {
            if (key == currentAction) {
                value.play()
            }
        })
        this.orbitControl = orbitControl
        this.camera = camera
        this.updateCameraTarget(0,0)
    }

    public switchRunToggle() {
        this.toggleRun = !this.toggleRun
    }
    public moveToLeaderboard() {
        const leaderboardPosition = new THREE.Vector3(15, 5, 0); // Position of the leaderboard in 3D space
        const directionToLeaderboard = leaderboardPosition.clone().sub(this.model.position).normalize();
        
        const velocity = this.toggleRun ? this.runVelocity : this.walkVelocity;
        const moveX = directionToLeaderboard.x * velocity * 0.016; // Multiply by delta time
        const moveZ = directionToLeaderboard.z * velocity * 0.016;
    
        // Move the character
        this.model.position.x += moveX;
        this.model.position.z += moveZ;
    
        // Update camera target
        this.updateCameraTarget(moveX, moveZ);
    }
    

    public update(delta: number, keysPressed: any) {
        const directionPressed = DIRECTIONS.some(key => keysPressed[key] == true);
    
        var play = 'Walk';
        if (directionPressed && this.toggleRun) {
            play = 'Run';
        } else if (directionPressed) {
            play = 'Walk';
        } else {
            play = 'Idle';
        }
    
        if (this.currentAction != play) {
            console.log('Available animations:', Array.from(this.animationsMap.keys()));
            console.log('Current action:', this.currentAction);
            console.log('Next action:', play);
    
            const toPlay = this.animationsMap.get(play);
            const current = this.animationsMap.get(this.currentAction);
    
            if (!current) {
                console.error(`Current animation '${this.currentAction}' is missing!`);
            }
            if (!toPlay) {
                console.error(`Next animation '${play}' is missing!`);
            }
    
            current?.fadeOut(this.fadeDuration);
            toPlay?.reset().fadeIn(this.fadeDuration).play();
    
            this.currentAction = play;
        }
    
        this.mixer.update(delta);
    
        if (this.currentAction == 'Run' || this.currentAction == 'Walk') {
            var angleYCameraDirection = Math.atan2(
                (this.camera.position.x - this.model.position.x),
                (this.camera.position.z - this.model.position.z)
            );
            var directionOffset = this.directionOffset(keysPressed);
    
            this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffset);
            this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.2);
    // calculate direction and invert it
this.camera.getWorldDirection(this.walkDirection);
this.walkDirection.y = 0;
this.walkDirection.normalize();
this.walkDirection.negate(); // Invert direction to move forward
this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset);
    
            const velocity = this.currentAction == 'Run' ? this.runVelocity : this.walkVelocity;
    
            const moveX = this.walkDirection.x * velocity * delta;
            const moveZ = this.walkDirection.z * velocity * delta;
            this.model.position.x += moveX;
            this.model.position.z += moveZ;
            this.updateCameraTarget(moveX, moveZ);
        }
    }
    
    private updateCameraTarget(moveX: number, moveZ: number) {
        // move camera
        this.camera.position.x += moveX
        this.camera.position.z += moveZ

        // update camera target
        this.cameraTarget.x = this.model.position.x
        this.cameraTarget.y = this.model.position.y + 1
        this.cameraTarget.z = this.model.position.z
        this.orbitControl.target = this.cameraTarget
    }

    private directionOffset(keysPressed: any) {
        var directionOffset = 0 // w

        if (keysPressed[W]) {
            if (keysPressed[A]) {
                directionOffset = Math.PI / 4 // w+a
            } else if (keysPressed[D]) {
                directionOffset = - Math.PI / 4 // w+d
            }
        } else if (keysPressed[S]) {
            if (keysPressed[A]) {
                directionOffset = Math.PI / 4 + Math.PI / 2 // s+a
            } else if (keysPressed[D]) {
                directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d
            } else {
                directionOffset = Math.PI // s
            }
        } else if (keysPressed[A]) {
            directionOffset = Math.PI / 2 // a
        } else if (keysPressed[D]) {
            directionOffset = - Math.PI / 2 // d
        }

        return directionOffset
    }
}

