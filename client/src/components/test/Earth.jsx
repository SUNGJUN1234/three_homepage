import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import earthTexture from "../../assets/img/earth_atmos.jpg";
import earthCloudsTexture from "../../assets/img/earth_clouds.png";
import earthNomalTexture from "../../assets/img/earth_normal.jpg";
import earthSpecularTexture from "../../assets/img/earth_specular.jpg";
import getStarfield from '../../assets/js/getStarfield.js';
import { getFresnelMat } from '../../assets/js/getFrensnelMat.js';

const Earth = () => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const earthGroupRef = useRef(null);
    const cloudsMeshRef = useRef(null);

    const _setupCamera = () => {
        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 10;
        cameraRef.current = camera;
    };

    const _setupLight = () => {
        // Light setup
        const light = new THREE.DirectionalLight(0xffffff, 1);
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
            specular: 0x7c7c7c,
            shininess: 15,
            map: loader.load(earthTexture),
            specularMap: loader.load(earthSpecularTexture),
            normalMap: loader.load(earthNomalTexture),
            // normalScale: new THREE.Vector2( 0.85, - 0.85 )
         });
         earthMaterial.map.colorSpace = THREE.SRGBColorSpace;
        const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
        earthGroup.add(earthMesh);

        // mat setup
        const cloudsMat = new THREE.MeshLambertMaterial({
            map: loader.load(earthCloudsTexture),
            transparent: true,
        })
        const cloudsMesh = new THREE.Mesh(earthGeometry, cloudsMat);
        cloudsMesh.scale.setScalar(1.003);
        earthGroup.add(cloudsMesh);
        cloudsMeshRef.current = cloudsMesh;

        const fresnelMat = getFresnelMat();
        const glowMesh = new THREE.Mesh(earthGeometry, fresnelMat);
        glowMesh.scale.setScalar(1.005);
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
            earthGroupRef.current.rotation.y = -time / 5;
            if (cloudsMeshRef.current) {
                cloudsMeshRef.current.rotation.y = -time / 20; // clouds 더 빠르게 회전
            }

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
