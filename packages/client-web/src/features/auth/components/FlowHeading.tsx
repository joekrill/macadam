import { Heading, Text, VStack } from "@chakra-ui/react";
import { ReactChild } from "react";

export interface FlowHeadingProps {
  title: ReactChild;
  subtitle?: ReactChild;
}

export const FlowHeading = ({ title, subtitle }: FlowHeadingProps) => (
  <VStack align="center" textAlign="center" spacing="4">
    <Heading size="xl" fontWeight="extrabold">
      {title}
    </Heading>
    {subtitle && <Text>{subtitle}</Text>}
  </VStack>
);
