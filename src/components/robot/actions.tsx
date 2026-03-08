import { Button, HStack } from "@chakra-ui/react";
import { useRobotContext } from "./context";

export function RobotActions() {
    const { mode, startEdit, cancelEdit, submitPose, isSubmitting } = useRobotContext();

    if (mode === "view") {
        return (
            <Button onClick={startEdit} width="full">
                Edit Pose
            </Button>
        );
    }

    return (
        <HStack>
            <Button variant="outline" onClick={cancelEdit} flex="1">
                Cancel
            </Button>
            <Button onClick={submitPose} loading={isSubmitting} flex="1">
                Set Pose
            </Button>
        </HStack>
    );
}
