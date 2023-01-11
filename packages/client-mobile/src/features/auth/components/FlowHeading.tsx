import { Heading, IStackProps, Text, VStack } from "native-base";
import { ReactNode } from "react";

export interface FlowHeadingProps {
  title: ReactNode;
  subtitle?: ReactNode;
  textAlign?: IStackProps["textAlign"];
}

export const FlowHeading = ({
  title,
  subtitle,
  textAlign = "center",
}: FlowHeadingProps) => (
  <VStack alignItems="stretch" space="md" textAlign={textAlign}>
    <Heading size="xl" fontWeight="extrabold">
      {title}
    </Heading>
    {subtitle && <Text>{subtitle}</Text>}
  </VStack>
);
