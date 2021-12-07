import { Container, ContainerProps, useColorModeValue } from "@chakra-ui/react";

export interface PolicyContainerProps extends ContainerProps {}

/**
 * A container for generated policies, i.e. using TermsFeed or similar
 *
 * @see {@link https://app.termsfeed.com/}
 *
 * This allows the HTML to be rendered as a child without having to replace
 * the elements with Chakra components.
 *
 */
export const PolicyContainer = ({
  children,
  ...props
}: PolicyContainerProps) => (
  <Container
    maxW="container.lg"
    {...props}
    sx={{
      "&": {
        h1: {
          fontSize: "3xl",
          fontWeight: "bold",
          fontFamily: "heading",
        },
        h2: {
          fontSize: "2xl",
          fontFamily: "heading",
        },
        h3: {
          fontSize: "xl",
          fontFamily: "heading",
        },
        p: {
          my: 3,
        },
        ul: {
          ml: 5,
        },
        a: {
          color: useColorModeValue("blue.500", "blue.300"),
        },
      },
    }}
  >
    {children}
  </Container>
);
