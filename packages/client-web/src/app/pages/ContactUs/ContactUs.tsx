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
            id: "contactUs.page.title",
            description: "The page title for the Contact Us page.",
            defaultMessage: "Contact Us",
          })}
        </title>
      </Helmet>
      <ScrollToTop />
      <Heading>
        <FormattedMessage
          id="contactUs.page.heading"
          description="The text to show as the heading of the Contact Us page."
          defaultMessage="Contact Us"
        />
      </Heading>
      <Text py="5">
        <FormattedMessage
          id="contactUs.page.instructions"
          description="The instructions displayed at the top of the Contact Us page directing the user to send an email or fill at a form."
          defaultMessage="Email us at <mailto>{emailAddress}</mailto> or fill out the form below for any feedback, questions, problems, or feature requests."
          values={{
            emailAddress: process.env.VITE_EMAIL_CONTACT,
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
