import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useRobotContext } from "./context";

export function RobotController({ children }: { children: React.ReactNode }) {
    const { mode } = useRobotContext();

    return (
        <Box h="100%" minH={0} borderWidth="1px" borderRadius="xl" bg="bg.panel" overflow="auto">
            <HStack justify="space-between" px={4} py={3} borderBottomWidth="1px">
                <Text fontWeight="bold">Robot Controller</Text>
                <Text fontSize="sm" color="fg.muted">
                    {mode === "edit" ? "Editing snapshot pose" : "Live telemetry"}
                </Text>
            </HStack>

            <VStack align="stretch" gap={4} p={4}>
                {children}
            </VStack>
        </Box>
    );
}
