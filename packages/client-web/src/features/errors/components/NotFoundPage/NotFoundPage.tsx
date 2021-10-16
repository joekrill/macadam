import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { FormattedMessage, useIntl } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import { ReactComponent as Lost } from "./Lost.svg";

export interface NotFoundPageProps {}

export const NotFoundPage = () => {
  const { formatMessage } = useIntl();

  return (
    <Center p={5}>
      <Helmet>
        <title>
          {formatMessage({
            id: "errors.notFoundPage.pageTitle",
            defaultMessage: "Not Found",
          })}
        </title>
      </Helmet>
      <VStack>
        <Heading as="h1" display="flex" fontSize="7rem">
          <FormattedMessage
            id="errors.notFoundPage.pageHeading"
            defaultMessage="Ooops!"
          />
        </Heading>
        <Heading fontSize="3xl" fontWeight={400}>
          <FormattedMessage
            id="errors.notFoundPage.message"
            defaultMessage="We can't seem to find that page."
          />
        </Heading>
        <Button as={RouterLink} colorScheme="blue" to="/" mt={3}>
          <FormattedMessage
            id="errors.notFoundPage.goToHomepageButton"
            defaultMessage="Go to the homepage"
          />
        </Button>
        <Text color="gray.500">
          <FormattedMessage
            id="errors.notFoundPage.errorCode"
            defaultMessage="Code: {code}"
            values={{ code: 404 }}
          />
        </Text>
        <Lost
          style={{
            maxHeight: "300px",
          }}
        />
      </VStack>
    </Center>
  );
};
