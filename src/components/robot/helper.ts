import type { DisplayJoint, JointConfig, PosePayload, TelemetryJointPosition } from "./types";

export function buildDisplayJoints(jointConfigs: JointConfig[], telemetry: TelemetryJointPosition[], urdfJointNames?: string[]): DisplayJoint[] {
    const telemetryById = new Map(telemetry.map((joint) => [joint.id, joint.position]));

    const urdfJointNameSet = new Set(urdfJointNames ?? []);

    return [...jointConfigs]
        .sort((a, b) => a.id - b.id)
        .map((config) => {
            const hasTelemetry = telemetryById.has(config.id);
            const inUrdf = urdfJointNames ? urdfJointNameSet.has(config.name) : true;

            let status: DisplayJoint["status"] = "ok";

            if (!inUrdf) {
                status = "missing-in-urdf";
            } else if (!hasTelemetry) {
                status = "missing-telemetry";
            }

            return {
                id: config.id,
                name: config.name,
                default_position: config.default_position,
                min_position: config.min_position,
                max_position: config.max_position,
                position: telemetryById.get(config.id) ?? config.default_position,
                status,
            };
        });
}

export function cloneDisplayJoints(joints: DisplayJoint[]): DisplayJoint[] {
    return joints.map((joint) => ({ ...joint }));
}

export function toPosePayload(joints: DisplayJoint[]): PosePayload {
    return joints.map((joint) => ({
        id: joint.id,
        position: joint.position,
    }));
}
