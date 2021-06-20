import { Box, Button, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import {
  FcDoughnutChart,
  FcMultipleDevices,
  FcPrivacy,
  FcTimeline,
} from "react-icons/fc";
import { Feature } from "./Feature";

export const Home = () => (
  <Box maxW="5xl" mx="auto">
    <Box
      maxW="2xl"
      mx="auto"
      px={{ base: "6", lg: "8" }}
      py={{ base: "16", sm: "20" }}
      textAlign="center"
    >
      <Heading as="h2" size="3xl" fontWeight="extrabold" letterSpacing="tight">
        A short tagline about what we do.
      </Heading>
      <Text mt="4" fontSize="lg">
        Ac euismod vel sit maecenas id pellentesque eu sed consectetur.
        Malesuada adipiscing sagittis vel nulla nec.
      </Text>
      <Button
        mt="8"
        as="a"
        href="#"
        size="lg"
        colorScheme="blue"
        fontWeight="bold"
      >
        Get started
      </Button>
    </Box>
    <Box as="section" py="12" px={{ base: "6", md: "8" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        spacingX="10"
        spacingY={{ base: "8", md: "14" }}
      >
        <Feature title="Secure by default" icon={<FcPrivacy />}>
          At vero eos et accusam et justo duo dolores et ea rebum. Stet clita
          kasd gubergren, no sea takimata sanctus.
        </Feature>
        <Feature title="Always up to date" icon={<FcTimeline />}>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore.
        </Feature>
        <Feature title="Incredible statistics" icon={<FcDoughnutChart />}>
          At vero eos et accusam et justo duo dolores et ea rebum. Stet clita
          kasd gubergren, no sea takimata sanctus.
        </Feature>
        <Feature
          title="Support for multiple devices"
          icon={<FcMultipleDevices />}
        >
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore.
        </Feature>
      </SimpleGrid>
    </Box>
  </Box>
);
