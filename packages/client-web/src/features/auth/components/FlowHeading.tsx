import { Heading, Text, TypographyProps, VStack } from "@chakra-ui/react";
import { ReactChild } from "react";

export interface FlowHeadingProps {
  title: ReactChild;
  subtitle?: ReactChild;
  textAlign?: TypographyProps["textAlign"];
}

export const FlowHeading = ({
  title,
  subtitle,
  textAlign = "center",
}: FlowHeadingProps) => (
  <VStack align="stretch" spacing="4" textAlign={textAlign}>
    <Heading size="xl" fontWeight="extrabold">
      {title}
    </Heading>
    {subtitle && <Text>{subtitle}</Text>}
  </VStack>
);
