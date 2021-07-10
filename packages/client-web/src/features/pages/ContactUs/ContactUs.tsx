import {
  Container,
  ContainerProps,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";
import { ScrollToTop } from "../../common/components/ScrollToTop/ScrollToTop";

export interface ContactUsProps extends ContainerProps {}

export const ContactUs = (props: ContactUsProps) => (
  <Container maxW="container.lg" p={3} {...props}>
    <ScrollToTop />
    <Heading>Contact Us</Heading>
    <Text>
      Email us at{" "}
      <Link href={`mailto:${process.env.REACT_APP_EMAIL_SUPPORT}`}>
        {process.env.REACT_APP_EMAIL_SUPPORT}
      </Link>{" "}
      with any feedback, questions, problems, or feature requests.
    </Text>
  </Container>
);
