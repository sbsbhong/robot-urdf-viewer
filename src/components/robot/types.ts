export type RobotModel = "T12" | "TriATHLETE" | "TriATHLETE_Climbing";

export type JointConfig = {
    id: number;
    name: string;
    default_position: number;
    min_position: number;
    max_position: number;
};

export type TelemetryJointPosition = {
    id: number;
    position: number;
};

export type RobotMode = "view" | "edit";

type JointConnectionStatus = "ok" | "missing-in-urdf" | "missing-telemetry" | "missing-config";

export type DisplayJoint = {
    id: number;
    name: string;
    status: JointConnectionStatus;
    min_position: number;
    max_position: number;
    default_position: number;
    position: number;
};

export type PosePayload = Array<{
    id: number;
    position: number;
}>;

export type RobotRootProps = {
    model: RobotModel;
    jointConfigs: JointConfig[];
    telemetry: TelemetryJointPosition[];
    children: React.ReactNode;
    onSetPose?: (joints: Array<{ id: number; position: number }>) => Promise<void> | void;
};
