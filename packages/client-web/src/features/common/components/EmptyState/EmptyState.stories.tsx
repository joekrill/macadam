import { Box, Button, Icon } from "@chakra-ui/react";
import { Meta, Story } from "@storybook/react";
import {
  FaAward,
  FaCalendarAlt,
  FaDatabase,
  FaExclamation,
  FaLandmark,
  FaPepperHot,
  FaPlus,
  FaRoad,
  FaShoppingCart,
  FaUser,
  FaVial,
  FaWarehouse,
  FaYinYang,
} from "react-icons/fa";
import { EmptyState, EmptyStateProps } from "./EmptyState";

const icons = {
  FaAward,
  FaCalendarAlt,
  FaDatabase,
  FaExclamation,
  FaLandmark,
  FaPepperHot,
  FaRoad,
  FaShoppingCart,
  FaUser,
  FaVial,
  FaWarehouse,
  FaYinYang,
};

export default {
  title: "Common/EmptyState",
  component: EmptyState,
  argTypes: {
    message: {
      control: { type: "text" },
      defaultValue: "There are no things",
    },
    icon: {
      options: [undefined, ...Object.keys(icons)],
      mapping: {
        undefined: undefined,
        ...icons,
      },
      control: {
        type: "select",
        labels: {
          undefined: "None",
        },
      },
      defaultValue: "FaPepperHot",
    },
  },
} as Meta;

const Template: Story<Omit<EmptyStateProps, "children"> & {}> = (args) => (
  <Box maxW="md">
    <EmptyState {...args}>
      <Button leftIcon={<Icon as={FaPlus} />}>Create a new thing</Button>
    </EmptyState>
  </Box>
);

export const Default = Template.bind({});

Default.storyName = "EmptyState";
