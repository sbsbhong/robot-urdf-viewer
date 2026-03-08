import { Box, HStack, Separator, Text, VStack } from "@chakra-ui/react";
import { useRobotContext } from "./context";

export function RobotLiveValues() {
    const { liveJoints, setHoveredJointName } = useRobotContext();

    return (
        <Box>
            <Text fontWeight="semibold" mb={3}>
                Live Joint Values
            </Text>

            <VStack align="stretch" gap={2}>
                {liveJoints.map((joint, index) => (
                    <Box key={joint.id} onMouseEnter={() => setHoveredJointName(joint.name)} onMouseLeave={() => setHoveredJointName(null)}>
                        <HStack justify="space-between">
                            <Text color={joint.status === "ok" ? "fg.muted" : joint.status === "missing-telemetry" ? "orange.400" : "red.400"}>
                                {joint.name}
                            </Text>
                            <Text fontFamily="mono">{joint.position.toFixed(2)}</Text>
                        </HStack>
                        {index < liveJoints.length - 1 && <Separator mt={2} />}
                    </Box>
                ))}
            </VStack>
        </Box>
    );
}
