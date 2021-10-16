import {
  Container,
  ContainerProps,
  Heading,
  List,
  ListIcon,
  ListItem,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FormattedMessage, useIntl } from "react-intl";
import { ScrollToTop } from "../../common/components/ScrollToTop/ScrollToTop";

export interface FaqProps extends ContainerProps {}

export const Faq = (props: FaqProps) => {
  const { formatMessage } = useIntl();

  return (
    <Container maxW="container.lg" p={3} {...props}>
      <Helmet>
        <title>
          {formatMessage({
            id: "pages.faq.pageTitle",
            defaultMessage: "FAQ",
          })}
        </title>
      </Helmet>
      <ScrollToTop />
      <Heading mb={3}>
        <FormattedMessage
          id="pages.faq.pageHeading"
          defaultMessage="Frequently Asked Questions"
        />
      </Heading>
      <List as="dl" spacing={3}>
        <ListItem as="dt" fontWeight="bold">
          <ListIcon as={FaRegQuestionCircle} color="green.500" />
          Consequatur ad voluptatem eos eum?
        </ListItem>
        <ListItem as="dd">
          Blanditiis rerum incidunt nesciunt expedita quia sit. Et optio
          inventore voluptate dolorem ipsum. Reiciendis eum natus
          exercitationem.
        </ListItem>
        <ListItem as="dt" fontWeight="bold">
          <ListIcon as={FaRegQuestionCircle} color="green.500" />
          Laudantium amet ut et et repudiandae quod a nisi?
        </ListItem>
        <ListItem as="dd">
          Facere sint porro explicabo veniam ut quia et. In amet aut similique.
          Quisquam eius officia temporibus modi dolorem dolor.
        </ListItem>
      </List>
    </Container>
  );
};
