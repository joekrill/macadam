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
            id="pages.home.tagLine"
            defaultMessage="A short tagline about what we do."
          />
        </Heading>
        <Text mt="4" fontSize="lg">
          <FormattedMessage
            id="pages.home.introductionText"
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
            id="pages.home.getStartedCtaButton"
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
              id: "pages.home.features.secureByDefault.title",
              defaultMessage: "Secure by default",
            })}
            icon={<FcPrivacy />}
          >
            <FormattedMessage
              id="pages.home.features.secureByDefault.description"
              defaultMessage="At vero eos et accusam et justo duo dolores et ea rebum. Stet clita
          kasd gubergren, no sea takimata sanctus."
            />
          </Feature>
          <Feature
            title={formatMessage({
              id: "pages.home.features.alwaysUpToDate.title",
              defaultMessage: "Always up to date",
            })}
            icon={<FcTimeline />}
          >
            <FormattedMessage
              id="pages.home.features.alwaysUpToDate.description"
              defaultMessage="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore."
            />
          </Feature>
          <Feature
            title={formatMessage({
              id: "pages.home.features.statistics.title",
              defaultMessage: "Incredible statistics",
            })}
            icon={<FcDoughnutChart />}
          >
            <FormattedMessage
              id="pages.home.features.statistics.description"
              defaultMessage="At vero eos et accusam et justo duo dolores et ea rebum. Stet clita
              kasd gubergren, no sea takimata sanctus."
            />
          </Feature>
          <Feature
            title={formatMessage({
              id: "pages.home.features.multipleDevices.title",
              defaultMessage: "Support for multiple devices",
            })}
            icon={<FcMultipleDevices />}
          >
            <FormattedMessage
              id="pages.home.features.multipleDevices.description"
              defaultMessage="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore."
            />
          </Feature>
        </SimpleGrid>
      </Box>
    </Box>
  );
};
