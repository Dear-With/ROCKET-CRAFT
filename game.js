import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

let camera, scene, renderer, controls;
let objects = [];
let raycaster;
const moveForward = false;
const moveBackward = false;
const moveLeft = false;
const moveRight = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 10;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 0, 750);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 0);
    scene.add(light);

    const light2 = new THREE.DirectionalLight(0xffffff);
    light2.position.set(0, 200, 100);
    light2.castShadow = true;
    light2.shadow.camera.top = 50;
    light2.shadow.camera.bottom = -25;
    light2.shadow.camera.left = -25;
    light2.shadow.camera.right = 25;
    scene.add(light2);

    controls = new PointerLockControls(camera, document.body);

    document.addEventListener('click', function () {
        controls.lock();
    }, false);

    scene.add(controls.getObject());

    const onKeyDown = function (event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;
        }
    };

    const onKeyUp = function (event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;
        }
    };

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

    const floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    floorGeometry.rotateX(- Math.PI / 2);

    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    scene.add(floor);

    const boxGeometry = new THREE.BoxGeometry(20, 20, 20);
    const boxMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });

    for (let i = 0; i < 500; i++) {
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.x = Math.floor(Math.random() * 20 - 10) * 20;
        box.position.y = Math.floor(Math.random() * 20) * 20 + 10;
        box.position.z = Math.floor(Math.random() * 20 - 10) * 20;
        scene.add(box);
        objects.push(box);
    }

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();
    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveLeft) - Number(moveRight);
    direction.normalize();

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    controls.moveRight(- velocity.x * delta);
    controls.moveForward(- velocity.z * delta);

    controls.getObject().position.y += (velocity.y * delta);

    if (controls.getObject().position.y < 10) {
        velocity.y = 0;
        controls.getObject().position.y = 10;
    }

    prevTime = time;

    renderer.render(scene, camera);
}
