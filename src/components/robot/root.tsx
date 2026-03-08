import { useCallback, useEffect, useMemo, useState } from "react";
import { ROBOT_MODELS } from "./registry";
import { RobotContextProvider } from "./context";
import { buildDisplayJoints, cloneDisplayJoints, toPosePayload } from "./helper";
import type { DisplayJoint, RobotRootProps } from "./types";

export function RobotRoot({ model, jointConfigs, telemetry, children, onSetPose }: RobotRootProps) {
    const [mode, setMode] = useState<"view" | "edit">("view");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [urdfJointNames, setUrdfJointNames] = useState<string[]>([]);
    const [hoveredJointName, setHoveredJointName] = useState<string | null>(null);

    const [liveJoints, setLiveJoints] = useState<DisplayJoint[]>([]);
    const [editJoints, setEditJoints] = useState<DisplayJoint[] | null>(null);

    const modelDefinition = useMemo(() => ROBOT_MODELS[model], [model]);

    useEffect(() => {
        if (mode !== "view") return;
        setLiveJoints(buildDisplayJoints(jointConfigs, telemetry, urdfJointNames));
    }, [mode, jointConfigs, telemetry, urdfJointNames]);

    const startEdit = useCallback(() => {
        setEditJoints(cloneDisplayJoints(liveJoints));
        setMode("edit");
    }, [liveJoints]);

    const cancelEdit = useCallback(() => {
        setEditJoints(null);
        setMode("view");
    }, []);

    const updateJointPosition = useCallback((id: number, position: number) => {
        setEditJoints((prev) => prev?.map((joint) => (joint.id === id ? { ...joint, position } : joint)) ?? null);
    }, []);

    const submitPose = useCallback(async () => {
        if (!editJoints || !onSetPose) return;

        try {
            setIsSubmitting(true);
            await onSetPose(toPosePayload(editJoints));
            setMode("view");
            setEditJoints(null);
        } finally {
            setIsSubmitting(false);
        }
    }, [editJoints, onSetPose]);

    const value = useMemo(
        () => ({
            model,
            modelDefinition,
            mode,
            isSubmitting,
            liveJoints,
            previewJoints: editJoints ?? [],
            startEdit,
            cancelEdit,
            updateJointPosition,
            submitPose,
            urdfJointNames,
            setUrdfJointNames,
            hoveredJointName,
            setHoveredJointName,
        }),
        [
            model,
            modelDefinition,
            mode,
            isSubmitting,
            liveJoints,
            editJoints,
            startEdit,
            cancelEdit,
            updateJointPosition,
            submitPose,
            urdfJointNames,
            hoveredJointName,
            setUrdfJointNames,
            setHoveredJointName,
        ],
    );

    return <RobotContextProvider value={value}>{children}</RobotContextProvider>;
}
