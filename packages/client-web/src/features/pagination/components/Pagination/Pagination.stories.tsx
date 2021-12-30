import { Container } from "@chakra-ui/react";
import { Meta, Story } from "@storybook/react";
import { theme } from "../../../theme/default";
import { Pagination, PaginationProps } from "./Pagination";

export default {
  title: "Pagination/Pagination",
  component: Pagination,
  argTypes: {
    totalPages: {
      control: { type: "number", min: 0 },
    },
    currentPage: {
      control: { type: "number", min: 1 },
    },
    colorScheme: {
      options: Object.keys(theme.colors),
      control: { type: "select" },
    },
    size: {
      options: Object.keys(theme.components.Button.sizes),
      control: { type: "inline-radio" },
    },
  },
} as Meta;

const Template: Story<PaginationProps> = (args: PaginationProps) => (
  <Container maxW="container.lg">
    <Pagination {...args} />
  </Container>
);

export const Default = Template.bind({});

Default.storyName = "Pagination";
