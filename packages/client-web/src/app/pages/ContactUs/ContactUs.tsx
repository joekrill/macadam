import {
  Container,
  ContainerProps,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { FormattedMessage, useIntl } from "react-intl";
import { Card } from "../../../features/common/components/Card/Card";
import { ContactUsCreate } from "../../../features/contactUs/components/ContactUsCreate/ContactUsCreate";
import { ScrollToTop } from "../../../features/routing/components/ScrollToTop";

export interface ContactUsProps extends ContainerProps {}

export const ContactUs = (props: ContactUsProps) => {
  const { formatMessage } = useIntl();
  return (
    <Container maxW="container.md" {...props}>
      <Helmet>
        <title>
          {formatMessage({
            id: "pages.contactUs.title",
            defaultMessage: "Contact Us",
          })}
        </title>
      </Helmet>
      <ScrollToTop />
      <Heading>
        <FormattedMessage
          id="pages.contactUs.heading"
          defaultMessage="Contact Us"
        />
      </Heading>
      <Text py="5">
        <FormattedMessage
          id="pages.contactUs.instructions"
          defaultMessage="Email us at <mailto>{emailAddress}</mailto> or fill out the form below for any feedback, questions, problems, or feature requests."
          values={{
            emailAddress: process.env.REACT_APP_EMAIL_CONTACT,
            mailto: (emailAddress) => (
              <Link href={`mailto:${emailAddress}`}>{emailAddress}</Link>
            ),
          }}
        />
      </Text>
      <Card>
        <ContactUsCreate />
      </Card>
    </Container>
  );
};
