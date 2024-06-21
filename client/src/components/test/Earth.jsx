import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import earthTexture from "../../assets/img/earthmap.jpg";

const Earth = () => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const groupRef = useRef(null);

    const _setupCamera = () => {
        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 2;
        cameraRef.current = camera;
    };

    const _setupLight = () => {
        // Light setup
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(-1, 2, 4);
        sceneRef.current.add(light);
    };

    const _setupModel = () => {
        // Geometry and Material setup
        const loader = new THREE.TextureLoader();

        const geometry = new THREE.IcosahedronGeometry(1, 12);
        const material = new THREE.MeshPhongMaterial({ 
            map: loader.load(earthTexture,
                (texture) => {
                    console.log(texture);
                },
                undefined,
                (err) => {
                    console.error('An error occurred while loading the texture', err);
                }
            )
         });
        const earthMesh = new THREE.Mesh(geometry, material);
        
        // Group setup
        const group = new THREE.Group();
        group.add(earthMesh);
        sceneRef.current.add(group);
        groupRef.current = group;
    };

    const _setupControls = (camera, renderer) => {
        // OrbitControls setup
        new OrbitControls(camera, renderer.domElement);
    };

    useEffect(() => {
        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        _setupCamera();
        _setupLight();
        _setupModel();
        const camera = cameraRef.current;

        _setupControls(camera, renderer);

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Animation loop
        const animate = (time) => {
            time *= 0.0005;  // ms to seconds
            groupRef.current.rotation.x = time;
            groupRef.current.rotation.y = time;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();
        
        return () => {
            window.removeEventListener('resize', handleResize);
            mountRef.current.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={mountRef}>
        </div>
    );
};

export default Earth;
