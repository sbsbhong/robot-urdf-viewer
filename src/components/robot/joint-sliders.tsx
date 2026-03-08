import { Box, HStack, Slider, Text, VStack } from "@chakra-ui/react";
import { useRobotContext } from "./context";

type RobotJointSlidersProps = {
    step?: number;
};

export function RobotJointSliders({ step = 1 }: RobotJointSlidersProps) {
    const { mode, liveJoints, previewJoints, updateJointPosition, setHoveredJointName } = useRobotContext();

    const isDisabled = mode === "view";

    const joints = mode === "edit" ? previewJoints : liveJoints;

    return (
        <Box>
            <Text fontWeight="semibold" mb={3}>
                Joint Sliders
            </Text>

            <VStack align="stretch" gap={4}>
                {joints.map((joint) => (
                    <Box key={joint.id} onMouseEnter={() => setHoveredJointName(joint.name)} onMouseLeave={() => setHoveredJointName(null)}>
                        <HStack justify="space-between" mb={2}>
                            <Text color="fg.muted">{joint.name}</Text>
                            <Text fontFamily="mono">{joint.position.toFixed(2)}</Text>
                        </HStack>

                        <Slider.Root
                            value={[joint.position]}
                            min={joint.min_position}
                            max={joint.max_position}
                            step={step}
                            disabled={isDisabled}
                            onValueChange={(details) => {
                                updateJointPosition(joint.id, details.value[0] ?? joint.position);
                            }}>
                            <Slider.Control>
                                <Slider.Track>
                                    <Slider.Range />
                                </Slider.Track>
                                <Slider.Thumbs />
                            </Slider.Control>
                        </Slider.Root>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
}
