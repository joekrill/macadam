import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import { ReactComponent as Lost } from "./Lost.svg";

export interface NotFoundPageProps {}

export const NotFoundPage = () => (
  <Center p={5}>
    <Helmet>
      <title>Not Found</title>
    </Helmet>
    <VStack>
      <Heading as="h1" display="flex" fontSize="7rem">
        Ooops!
      </Heading>
      <Heading fontSize="3xl" fontWeight={400}>
        We can't seem to find that page.
      </Heading>
      <Button as={RouterLink} colorScheme="blue" to="/" mt={3}>
        Go to the homepage
      </Button>
      <Text color="gray.500">Code: 404</Text>
      <Lost
        style={{
          maxHeight: "300px",
        }}
      />
    </VStack>
  </Center>
);
