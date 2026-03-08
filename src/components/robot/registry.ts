import type { RobotModel } from "./types";

export type RobotModelDefinition = {
    urdfSrc: string;
    displayName: string;
    viewer: {
        cameraPosition: [number, number, number];
        scale: number;
        rotation?: [number, number, number];
    };
};

export const ROBOT_MODELS: Record<RobotModel, RobotModelDefinition> = {
    T12: {
        urdfSrc: "/robots/T12/urdf/T12.URDF",
        displayName: "Mini Arm V1",
        viewer: {
            cameraPosition: [2, 2, 2],
            scale: 0.2,
            rotation: [-Math.PI / 2, 0, 0],
        },
    },
    TriATHLETE: {
        urdfSrc: "/robots/TriATHLETE/urdf/TriATHLETE.URDF",
        displayName: "Mini Arm V2",
        viewer: {
            cameraPosition: [2.4, 2.2, 2.4],
            scale: 1,
            rotation: [-Math.PI / 2, 0, 0],
        },
    },
    TriATHLETE_Climbing: {
        urdfSrc: "/robots/TriATHLETE_Climbing/urdf/TriATHLETE_Climbing.URDF",
        displayName: "Mini Arm V2",
        viewer: {
            cameraPosition: [2.4, 2.2, 2.4],
            scale: 1,
        },
    },
};
