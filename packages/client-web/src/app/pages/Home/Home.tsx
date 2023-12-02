import {
  Box,
  BoxProps,
  Button,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import {
  FcDoughnutChart,
  FcMultipleDevices,
  FcPrivacy,
  FcTimeline,
} from "react-icons/fc";
import { FormattedMessage, useIntl } from "react-intl";
import { Feature } from "./Feature";

export interface HomeProps extends BoxProps {}

export const Home = (props: HomeProps) => {
  const { formatMessage } = useIntl();

  return (
    <Box maxW="5xl" mx="auto" {...props}>
      <Box
        maxW="2xl"
        mx="auto"
        px={{ base: "6", lg: "8" }}
        py={{ base: "16", sm: "20" }}
        textAlign="center"
      >
        <Heading
          as="h2"
          size="3xl"
          fontWeight="extrabold"
          letterSpacing="tight"
        >
          <FormattedMessage
            id="home.page.tagLine"
            description="The application tagline shown on the home page."
            defaultMessage="Opinionated, production-ready, full-featured SaaS boilerplate."
          />
        </Heading>
        <Text mt="4" fontSize="lg">
          <FormattedMessage
            id="home.page.introductionMessage"
            description="The introductory message shown on the home page."
            defaultMessage="Ac euismod vel sit maecenas id pellentesque eu sed consectetur.
              Malesuada adipiscing sagittis vel nulla nec."
          />
        </Text>
        <Button
          mt="8"
          as="a"
          href="#"
          size="lg"
          colorScheme="blue"
          fontWeight="bold"
        >
          <FormattedMessage
            id="home.page.getStartedCtaButton.text"
            description="Get started call-to-action button text"
            defaultMessage="Get started"
          />
        </Button>
      </Box>
      <Box as="section" py="12" px={{ base: "6", md: "8" }}>
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacingX="10"
          spacingY={{ base: "8", md: "14" }}
        >
          <Feature
            title={formatMessage({
              id: "home.page.features.secureByDefault.heading",
              description: 'The "Secure by default" feature name',
              defaultMessage: "Secure by default",
            })}
            icon={<FcPrivacy />}
          >
            <FormattedMessage
              id="home.page.features.secureByDefault.description"
              description='The "Secure by default" feature description'
              defaultMessage="At vero eos et accusam et justo duo dolores et ea rebum. Stet clita
          kasd gubergren, no sea takimata sanctus."
            />
          </Feature>
          <Feature
            title={formatMessage({
              id: "home.page.features.alwaysUpToDate.heading",
              description: 'The "Always up to date" feature name',
              defaultMessage: "Always up to date",
            })}
            icon={<FcTimeline />}
          >
            <FormattedMessage
              id="home.page.features.alwaysUpToDate.description"
              description='The "Always up to date" feature description'
              defaultMessage="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore."
            />
          </Feature>
          <Feature
            title={formatMessage({
              id: "home.page.features.statistics.heading",
              description: 'The "Incredible statistics" feature name',
              defaultMessage: "Incredible statistics",
            })}
            icon={<FcDoughnutChart />}
          >
            <FormattedMessage
              id="home.page.features.statistics.description"
              description='The "Incredible statistics" feature description'
              defaultMessage="At vero eos et accusam et justo duo dolores et ea rebum. Stet clita
              kasd gubergren, no sea takimata sanctus."
            />
          </Feature>
          <Feature
            title={formatMessage({
              id: "home.page.features.multipleDevices.heading",
              description: 'The "Support for multiple devices" feature name',
              defaultMessage: "Support for multiple devices",
            })}
            icon={<FcMultipleDevices />}
          >
            <FormattedMessage
              id="home.page.features.multipleDevices.description"
              description='The "Support for multiple devices" feature description'
              defaultMessage="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore."
            />
          </Feature>
        </SimpleGrid>
      </Box>
    </Box>
  );
};
