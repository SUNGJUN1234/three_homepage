import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import earthTexture from "../../assets/img/earthmap.jpg";
import earthLightTexture from "../../assets/img/earthlights.jpg";
import earthCloudsTexture from "../../assets/img/earthclouds.jpg";
import earthCloudsTransTexture from "../../assets/img/earthcloudstrans.jpg";
import getStarfield from '../../assets/js/getStarfield.js';
import { getFresnelMat } from '../../assets/js/getFrensnelMat.js';

const Earth = () => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const earthGroupRef = useRef(null);

    const _setupCamera = () => {
        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 10;
        cameraRef.current = camera;
    };

    const _setupLight = () => {
        // Light setup
        const light = new THREE.DirectionalLight(0xffffff, 0.1);
        light.position.set(-3, 2, 4);
        sceneRef.current.add(light);
    };

    const _setupModel = () => {
        // Geometry and Material setup
        const loader = new THREE.TextureLoader();
        const earthGroup = new THREE.Group();

        const detail = 8;
        const earthGeometry = new THREE.IcosahedronGeometry(1, detail);
        const earthMaterial = new THREE.MeshPhongMaterial({ 
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
        const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
        earthGroup.add(earthMesh);

        // mat setup
        const lightsMat = new THREE.MeshBasicMaterial({
            map: loader.load(earthLightTexture,
                (texture) => {
                    console.log(texture);
                },
                undefined,
                (err) => {
                    console.error('An error occurred while loading the texture', err);
                }
            ),
            blending: THREE.AdditiveBlending,
        })
        const lightsMesh = new THREE.Mesh(earthGeometry, lightsMat);
        earthGroup.add(lightsMesh);

        const cloudsMat = new THREE.MeshStandardMaterial({
            map: loader.load(earthCloudsTexture,
                (texture) => {
                    console.log(texture);
                },
                undefined,
                (err) => {
                    console.error('An error occurred while loading the texture', err);
                }
            ),
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            // alphaMap: loader.load(earthCloudsTransTexture),
        })
        const cloudsMesh = new THREE.Mesh(earthGeometry, cloudsMat);
        cloudsMesh.scale.setScalar(1.003);
        earthGroup.add(cloudsMesh);

        const fresnelMat = getFresnelMat();
        const glowMesh = new THREE.Mesh(earthGeometry, fresnelMat);
        glowMesh.scale.setScalar(1.003);
        earthGroup.add(glowMesh);

        // star setup
        const stars = getStarfield();
        sceneRef.current.add(stars);

        sceneRef.current.add(earthGroup);
        earthGroupRef.current = earthGroup;

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
        _setupModel();
        _setupLight();
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
            // earthGroupRef.current.rotation.x = time;
            earthGroupRef.current.rotation.y = -time / 5;

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
