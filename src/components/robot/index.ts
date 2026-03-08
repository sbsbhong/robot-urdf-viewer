import { RobotRoot } from "./root";
import { RobotViewport } from "./viewport";
import { RobotController } from "./controller";
import { RobotLiveValues } from "./live-values";
import { RobotJointSliders } from "./joint-sliders";
import { RobotActions } from "./actions";

export const Robot = {
    Root: RobotRoot,
    Viewport: RobotViewport,
    Controller: RobotController,
    LiveValues: RobotLiveValues,
    JointSliders: RobotJointSliders,
    Actions: RobotActions,
};

export type { RobotModel, JointConfig, TelemetryJointPosition, DisplayJoint } from "./types";
