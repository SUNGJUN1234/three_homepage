import PropTypes from 'prop-types';
import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import earthTexture from "../../assets/img/earth_atmos.jpg";
import earthCloudsTexture from "../../assets/img/earth_clouds.png";
import earthNormalTexture from "../../assets/img/earth_normal.jpg";
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
    const location = useLocation();
    const targetPositionRef = useRef({ x: 0, y: 0, z: 4 }); // 카메라의 목표 위치
    const debouncedHandleMouseMove = useRef(null);

    const _setupCamera = () => {
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(targetPositionRef.current.x, targetPositionRef.current.y, targetPositionRef.current.z); // 초기 카메라 위치 설정
        cameraRef.current = camera;
    };

    const _setupLight = () => {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(-3, 2, 4);
        sceneRef.current.add(light);
    };

    const _setupModel = () => {
        const loader = new THREE.TextureLoader();

        const earthGroup = new THREE.Group();

        const detail = 8;
        const earthGeometry = new THREE.IcosahedronGeometry(1, detail);
        const earthMaterial = new THREE.MeshPhongMaterial({
            specular: 0x7c7c7c,
            shininess: 15,
            map: loader.load(earthTexture),
            specularMap: loader.load(earthSpecularTexture),
            normalMap: loader.load(earthNormalTexture),
        });
        earthMaterial.map.colorSpace = THREE.SRGBColorSpace;
        const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
        earthGroup.add(earthMesh);

        const cloudsMat = new THREE.MeshLambertMaterial({
            map: loader.load(earthCloudsTexture),
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

        const stars = getStarfield();
        sceneRef.current.add(stars);

        sceneRef.current.add(earthGroup);
        earthGroupRef.current = earthGroup;
    };

    const handleMouseMove = useCallback((event) => {
        mouseXRef.current = (event.clientX / window.innerWidth) * 2 - 1;
        mouseYRef.current = -(event.clientY / window.innerHeight) * 2 + 1;
    }, []);

    useEffect(() => {
        debouncedHandleMouseMove.current = debounce(handleMouseMove, 10);
    }, [handleMouseMove]);

    const updateCameraPosition = (pathname) => {
        if (pathname === "/") {
            targetPositionRef.current.z = 4;
            document.addEventListener('mousemove', debouncedHandleMouseMove.current);
        } else if (pathname === "/about") {
            targetPositionRef.current.z = 2;
            mouseXRef.current = 0;
            mouseYRef.current = 0;
            document.removeEventListener('mousemove', debouncedHandleMouseMove.current);
        }
    };

    useEffect(() => {
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        _setupCamera();
        _setupModel()

            _setupLight();
            const camera = cameraRef.current;
            if (location.pathname === "/") {
                document.addEventListener('mousemove', debouncedHandleMouseMove.current);
            }
            const handleResize = () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            };

            window.addEventListener('resize', handleResize);

            const animate = (time) => {
                time *= 0.0005;
                earthGroupRef.current.rotation.y = -time / 5;
                if (cloudsMeshRef.current) {
                    cloudsMeshRef.current.rotation.y = -time / 20;
                }

                const cameraSpeed = 2;
                camera.position.x += (mouseXRef.current * cameraSpeed - camera.position.x) * 0.05;
                camera.position.y += (mouseYRef.current * cameraSpeed - camera.position.y) * 0.05;
                camera.position.z += (targetPositionRef.current.z - camera.position.z) * 0.05;
                camera.lookAt(scene.position);

                renderer.render(scene, camera);
                animationRef.current = requestAnimationFrame(animate);
            };

            animate();

            return () => {
                window.removeEventListener('resize', handleResize);
                document.removeEventListener('mousemove', debouncedHandleMouseMove.current);
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
    }, []);

    useEffect(() => {
        updateCameraPosition(location.pathname);
    }, [location.pathname]);

    return (
        <div ref={mountRef} style={{ position: 'relative', width: '100vw', height: '100vh' }}>
            <div key={location.key} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                {children}
            </div>
        </div>
    );
};

Earth.propTypes = {
    children: PropTypes.node
};

export default Earth;
