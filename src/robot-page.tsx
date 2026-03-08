import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { Robot, type RobotModel, type TelemetryJointPosition } from "@/components/robot";
import { t2JointConfigs } from "./stores/joint-configs";

export default function RobotPage() {
    const robotModel: RobotModel = "T12";
    const jointConfigs = useMemo(() => {
        return t2JointConfigs;
    }, []);
    const [telemetry, setTelemetry] = useState<TelemetryJointPosition[]>([
        { id: 1, position: 12 },
        { id: 2, position: -15 },
        { id: 3, position: 8 },
    ]);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setTelemetry(
                jointConfigs.map((_, id) => ({
                    id: id + 1,
                    position: Math.random(),
                })),
            );
        }, 1000);

        return () => window.clearInterval(timer);
    }, [jointConfigs, setTelemetry]);

    return (
        <Box h="100vh" p={4}>
            <Robot.Root
                model={robotModel}
                jointConfigs={jointConfigs}
                telemetry={telemetry}
                onSetPose={async (pose) => {
                    console.log("set pose", pose);
                    await new Promise((resolve) => setTimeout(resolve, 500));
                }}>
                <Flex h="100%" minH={0} gap={4}>
                    <Box flex="1" minW={0} minH={0}>
                        <Robot.Viewport />
                    </Box>

                    <Box w="360px" flexShrink={0}>
                        <Robot.Controller>
                            <Robot.LiveValues />
                            <Robot.JointSliders />
                            <Robot.Actions />
                        </Robot.Controller>
                    </Box>
                </Flex>
            </Robot.Root>
        </Box>
    );
}
