import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import earthTexture from "../../assets/img/earth_atmos.jpg";
import earthCloudsTexture from "../../assets/img/earth_clouds.png";
import earthNomalTexture from "../../assets/img/earth_normal.jpg";
import earthSpecularTexture from "../../assets/img/earth_specular.jpg";
import getStarfield from '../../assets/js/getStarfield.js';
import { getFresnelMat } from '../../assets/js/getFrensnelMat.js';
import { debounce } from 'lodash';

const Earth = ({ children }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const earthGroupRef = useRef(null);
    const cloudsMeshRef = useRef(null);
    const mouseXRef = useRef(0);
    const mouseYRef = useRef(0);
    const animationRef = useRef(null);

    const _setupCamera = () => {
        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 4;
        cameraRef.current = camera;
    };

    const _setupLight = () => {
        // Light setup
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(-3, 2, 4);
        sceneRef.current.add(light);
    };

    const _setupModel = async () => {
       // Geometry and Material setup
        const loader = new THREE.TextureLoader();
        const loadTexture = (path) => new Promise((resolve, reject) => {
            loader.load(path, resolve, undefined, reject);
        });

        const [earthTex, cloudsTex, normalTex, specularTex] = await Promise.all([
            loadTexture(earthTexture),
            loadTexture(earthCloudsTexture),
            loadTexture(earthNomalTexture),
            loadTexture(earthSpecularTexture)
        ]);

        const earthGroup = new THREE.Group();

        const detail = 8;
        const earthGeometry = new THREE.IcosahedronGeometry(1, detail);
        const earthMaterial = new THREE.MeshPhongMaterial({
            specular: 0x7c7c7c,
            shininess: 15,
            map: earthTex,
            specularMap: specularTex,
            normalMap: normalTex,
        });
        earthMaterial.map.colorSpace = THREE.SRGBColorSpace;
        const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
        earthGroup.add(earthMesh);

        const cloudsMat = new THREE.MeshLambertMaterial({
            map: cloudsTex,
            transparent: true,
        });
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

    const handleMouseMove = debounce((event) => {
        mouseXRef.current = (event.clientX / window.innerWidth) * 2 - 1;
        mouseYRef.current = -(event.clientY / window.innerHeight) * 2 + 1;
    }, 10);

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
        _setupModel().then(() => {
            _setupLight();
            const camera = cameraRef.current;

            document.addEventListener('mousemove', handleMouseMove);

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

                const cameraSpeed = 2;

                // 카메라 위치 업데이트
                camera.position.x += (mouseXRef.current * cameraSpeed - camera.position.x) * 0.05;
                camera.position.y += (mouseYRef.current * cameraSpeed - camera.position.y) * 0.05;
                camera.lookAt(scene.position);

                renderer.render(scene, camera);
                animationRef.current = requestAnimationFrame(animate);
            };

            animate();

            return () => {
                window.removeEventListener('resize', handleResize);
                document.removeEventListener('mousemove', handleMouseMove);
                cancelAnimationFrame(animationRef.current);
                if (mountRef.current && rendererRef.current) {
                    mountRef.current.removeChild(renderer.domElement);
                    renderer.dispose();
                }
                if (sceneRef.current) {
                    sceneRef.current.clear();
                }
                cameraRef.current = null;
                rendererRef.current = null;
                sceneRef.current = null;
                earthGroupRef.current = null;
                cloudsMeshRef.current = null;
            };
        });
    }, []);

    return (
        <div ref={mountRef} style={{ position: 'relative', width: '100vw', height: '100vh' }}>
            {children && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                {children}
            </div>}
        </div>
    );
};

export default Earth;
