import { Badge, Box, HStack, Text } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useRobotContext } from "./context";
import { RobotUrdfScene } from "./urdf-scene";

export function RobotViewport() {
    const { mode, modelDefinition } = useRobotContext();

    return (
        <Box h="100%" minH={0} w="100%" minW={0} borderWidth="1px" borderRadius="xl" overflow="hidden" bg="gray.900" color="white">
            <HStack justify="space-between" px={4} py={3} borderBottomWidth="1px" borderColor="whiteAlpha.200" bg="whiteAlpha.100">
                <Text fontWeight="bold">{modelDefinition.displayName}</Text>
                <Badge colorPalette={mode === "edit" ? "orange" : "green"}>{mode === "edit" ? "EDIT MODE" : "LIVE MODE"}</Badge>
            </HStack>

            <Box h="calc(100% - 49px)" minH={0}>
                <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }} camera={{ position: modelDefinition.viewer.cameraPosition, fov: 45 }}>
                    <color attach="background" args={["#111111"]} />
                    <Suspense fallback={null}>
                        <RobotUrdfScene />
                    </Suspense>
                </Canvas>
            </Box>
        </Box>
    );
}
