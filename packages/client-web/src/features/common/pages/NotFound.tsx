import { Button, Center, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

export interface NotFoundProps {}

export const NotFound = () => (
  <Center p={5}>
    <Helmet>
      <title>Not Found</title>
    </Helmet>
    <VStack>
      <Heading display="flex" fontSize="6xl">
        <Icon as={FaExclamationTriangle} color="red.500" mr={3} /> Ooops...
      </Heading>
      <Heading fontSize="md">We can't seem to find that page.</Heading>
      <Text>Error code: 404</Text>
      <Button as={RouterLink} colorScheme="blue" to="/" mt={3}>
        Go to the homepage
      </Button>
    </VStack>
  </Center>
);
