import { Box, BoxProps, Button, Text } from "@chakra-ui/react";
import { useState } from "react";

interface CrashInitiatorProps extends BoxProps {}

export const CrashInitiator = (props: CrashInitiatorProps) => {
  const [error, setError] = useState(false);
  if (error) {
    throw new Error("AAHHH!");
  }

  return (
    <Box p={3} {...props}>
      <Text>
        Clicking the button below will simulate an unexpected error, which
        should be caught by the closes ErrorBoundary and reported to our crash
        reporter.
      </Text>
      <Button colorScheme="red" onClick={() => setError(true)}>
        Trigger crash
      </Button>
    </Box>
  );
};
