import { createContext, useContext } from "react";
import type { DisplayJoint, RobotMode, RobotModel } from "./types";
import type { RobotModelDefinition } from "./registry";

export type RobotContextValue = {
    model: RobotModel;
    modelDefinition: RobotModelDefinition;

    mode: RobotMode;
    isSubmitting: boolean;

    liveJoints: DisplayJoint[];
    previewJoints: DisplayJoint[];

    urdfJointNames: string[];
    setUrdfJointNames: React.Dispatch<React.SetStateAction<string[]>>;

    hoveredJointName: string | null;
    setHoveredJointName: React.Dispatch<React.SetStateAction<string | null>>;

    startEdit: () => void;
    cancelEdit: () => void;
    updateJointPosition: (id: number, position: number) => void;
    submitPose: () => Promise<void>;
};

const RobotContext = createContext<RobotContextValue | null>(null);

export function RobotContextProvider({ value, children }: { value: RobotContextValue; children: React.ReactNode }) {
    return <RobotContext.Provider value={value}>{children}</RobotContext.Provider>;
}

export function useRobotContext() {
    const context = useContext(RobotContext);

    if (!context) {
        throw new Error("Robot components must be used within <Robot.Root />");
    }

    return context;
}
