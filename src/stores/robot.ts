import { create } from "zustand";
import type { JointConfig, RobotModel, TelemetryJointPosition } from "@/components/robot/types";

type RobotStoreState = {
    model: RobotModel | null;
    jointConfigs: JointConfig[];
    telemetry: TelemetryJointPosition[];

    setModel: (model: RobotModel) => void;
    setJointConfigs: (jointConfigs: JointConfig[]) => void;
    setTelemetry: (telemetry: TelemetryJointPosition[]) => void;
    updateTelemetryPosition: (id: number, position: number) => void;
    resetRobotRuntime: () => void;
};

export const useRobotStore = create<RobotStoreState>((set) => ({
    model: null,
    jointConfigs: [],
    telemetry: [],

    setModel: (model) => set({ model }),

    setJointConfigs: (jointConfigs) => set({ jointConfigs }),

    setTelemetry: (telemetry) => set({ telemetry }),

    updateTelemetryPosition: (id, position) =>
        set((state) => {
            const exists = state.telemetry.some((joint) => joint.id === id);

            if (!exists) {
                return {
                    telemetry: [...state.telemetry, { id, position }],
                };
            }

            return {
                telemetry: state.telemetry.map((joint) => (joint.id === id ? { ...joint, position } : joint)),
            };
        }),

    resetRobotRuntime: () =>
        set({
            model: null,
            jointConfigs: [],
            telemetry: [],
        }),
}));
