import {
  Container,
  ContainerProps,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { FormattedMessage, useIntl } from "react-intl";
import { ScrollToTop } from "../../routing/components/ScrollToTop";

export interface ContactUsProps extends ContainerProps {}

export const ContactUs = (props: ContactUsProps) => {
  const { formatMessage } = useIntl();
  return (
    <Container maxW="container.lg" {...props}>
      <Helmet>
        <title>
          {formatMessage({
            id: "pages.contactUs.pageTitle",
            defaultMessage: "Contact Us",
          })}
        </title>
      </Helmet>
      <ScrollToTop />
      <Heading>
        <FormattedMessage
          id="pages.contactUs.pageHeading"
          defaultMessage="Contact Us"
        />
      </Heading>
      <Text>
        <FormattedMessage
          id="pages.contactUs.instructions"
          defaultMessage="Email us at <emailLink>{emailAddress}</emailLink> with any feedback, questions, problems, or feature requests."
          values={{
            emailAddress: process.env.REACT_APP_EMAIL_SUPPORT,
            emailLink: (emailAddress: string) => (
              <Link href={`mailto:${emailAddress}`}>{emailAddress}</Link>
            ),
          }}
        />
      </Text>
    </Container>
  );
};
