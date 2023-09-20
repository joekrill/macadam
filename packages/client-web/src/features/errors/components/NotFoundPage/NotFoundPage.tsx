import { Center, Heading, Text, VStack } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { FormattedMessage, useIntl } from "react-intl";
import { HomepageButton } from "../../../common/components/HomepageButton";
import Lost from "./Lost.svg?react";

export interface NotFoundPageProps {}

export const NotFoundPage = () => {
  const { formatMessage } = useIntl();

  return (
    <Center p={5}>
      <Helmet>
        <title>
          {formatMessage({
            id: "errors.notFoundPage.title",
            defaultMessage: "Not Found",
            description:
              "The title shown in the browser tab/window for the not found page",
          })}
        </title>
      </Helmet>
      <VStack>
        <Heading as="h1" display="flex" fontSize="7rem">
          <FormattedMessage
            id="errors.notFoundPage.heading"
            defaultMessage="Ooops!"
            description="The text shown at the top of the not found page"
          />
        </Heading>
        <Heading fontSize="3xl" fontWeight={400}>
          <FormattedMessage
            id="errors.notFoundPage.message"
            defaultMessage="We can't seem to find that page."
            description="Error message shown on the not found page below the heading"
          />
        </Heading>
        <HomepageButton mt={3} />
        <Text color="gray.500">
          <FormattedMessage
            id="errors.notFoundPage.errorCode"
            defaultMessage="Code: {code}"
            description="Additional text on the error page that indicates this is a '404' error code"
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
