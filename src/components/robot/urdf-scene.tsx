import { useEffect, useRef, useState } from "react";
import { Grid, OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import URDFLoader, { type URDFRobot } from "urdf-loader";
import { useRobotContext } from "./context";

function RobotPrimitive({ robot, joints }: { robot: URDFRobot; joints: Array<{ name: string; position: number }> }) {
    useEffect(() => {
        for (const joint of joints) {
            if (robot.joints[joint.name]) {
                robot.setJointValue(joint.name, joint.position);
            }
        }
    }, [robot, joints]);

    return <primitive object={robot} dispose={null} />;
}

function CameraInitializer() {
    const { camera } = useThree();
    const { modelDefinition } = useRobotContext();

    useEffect(() => {
        camera.position.set(...modelDefinition.viewer.cameraPosition);
        camera.lookAt(0, 0, 0);
    }, [camera, modelDefinition]);

    return null;
}

export function RobotUrdfScene() {
    const { mode, modelDefinition, previewJoints, liveJoints, hoveredJointName } = useRobotContext();
    const [baseRobot, setBaseRobot] = useState<URDFRobot | null>(null);
    const [previewRobot, setPreviewRobot] = useState<URDFRobot | null>(null);

    // 로딩 완료 시점에 스타일을 적용하기 위해 ref 사용
    const baseRef = useRef<URDFRobot | null>(null);
    const previewRef = useRef<URDFRobot | null>(null);

    useEffect(() => {
        if (mode !== "view" || !baseRobot) return;
        applyHoverHighlight(baseRobot, hoveredJointName);
    }, [mode, baseRobot, hoveredJointName]);

    useEffect(() => {
        if (mode !== "edit" || !previewRobot) return;
        applyHoverHighlight(previewRobot, hoveredJointName);
    }, [mode, previewRobot, hoveredJointName]);

    useEffect(() => {
        let mounted = true;

        const manager = new THREE.LoadingManager();

        manager.onLoad = () => {
            if (!mounted) return;
            if (baseRef.current) initializeRobotStyle(baseRef.current, false);
            if (previewRef.current) initializeRobotStyle(previewRef.current, true);
        };

        const loader = new URDFLoader(manager);

        loader.packages = "/";

        loader.load(
            modelDefinition.urdfSrc,
            (loadedRobot) => {
                if (!mounted) return;
                baseRef.current = loadedRobot;
                setBaseRobot(loadedRobot);
            },
            undefined,
            (error) => {
                console.error("Failed to load URDF:", error);
            },
        );

        loader.load(
            modelDefinition.urdfSrc,
            (loadedRobot) => {
                if (!mounted) return;
                previewRef.current = loadedRobot;
                setPreviewRobot(loadedRobot);
            },
            undefined,
            (error) => {
                console.error("Failed to load ghost URDF:", error);
            },
        );

        return () => {
            mounted = false;
            setBaseRobot(null);
            setPreviewRobot(null);
        };
    }, [modelDefinition.urdfSrc]);

    return (
        <>
            <CameraInitializer />

            <ambientLight intensity={0.2} />
            <directionalLight position={[0, 6, 4]} intensity={1.6} />
            <hemisphereLight intensity={0.6} groundColor="#FFFFFF" />

            <Grid args={[10, 10]} cellSize={0.5} sectionSize={1} fadeDistance={20} fadeStrength={1} infiniteGrid />

            {/* {robot ? <RobotPrimitive robot={robot} jointKey={jointKey} /> : null} */}
            <group scale={modelDefinition.viewer.scale} rotation={modelDefinition.viewer.rotation}>
                {baseRobot ? <RobotPrimitive robot={baseRobot} joints={liveJoints} /> : null}
                {mode === "edit" && previewRobot ? <RobotPrimitive robot={previewRobot} joints={previewJoints} /> : null}
            </group>

            <OrbitControls makeDefault />
        </>
    );
}

function initializeRobotStyle(root: THREE.Object3D, isGhost: boolean = false) {
    root.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;

        // 공통: 그림자 켜기
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Preview 로봇인 경우에만 고스트 스타일 입히기
        if (isGhost && mesh.material) {
            // 원본 머티리얼 복제 (Base 로봇과 상태 공유 방지)
            if (Array.isArray(mesh.material)) {
                mesh.material = mesh.material.map((m) => m.clone());
            } else {
                mesh.material = mesh.material.clone();
            }

            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

            for (const material of materials) {
                const std = material as THREE.MeshStandardMaterial;

                std.transparent = true;
                std.opacity = 0.6;
                std.depthWrite = false;

                if (std.color) {
                    std.color.lerp(new THREE.Color("#4da3ff"), 0.75);
                }

                if ("emissive" in std && std.emissive) {
                    std.emissive.set(new THREE.Color("#1e5eff"));
                    std.emissiveIntensity = 0.35;
                }
            }
        }
    });
}

export function applyHoverHighlight(robot: URDFRobot, hoveredJointName: string | null) {
    //console.log(hoveredJointName !== null ? robot.joints[hoveredJointName] : "hoveredJointName");

    Object.entries(robot.joints).forEach(([jointName, jointObj]) => {
        jointObj.traverse((obj) => {
            const mesh = obj as THREE.Mesh;
            if (!mesh.isMesh || !mesh.material) return;

            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

            for (const material of materials) {
                const std = material as THREE.MeshStandardMaterial;

                if (!std.color) continue;

                if (jointName === hoveredJointName) {
                    std.emissive = new THREE.Color("#f59e0b");
                    std.emissiveIntensity = 0.35;
                } else {
                    if ("emissive" in std && std.emissive) {
                        std.emissive = new THREE.Color("#000000");
                        std.emissiveIntensity = 0;
                    }
                }
            }
        });
    });
}
