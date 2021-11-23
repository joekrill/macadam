import { Meta, Story } from "@storybook/react";
import { ColorModeSwitcher, ColorModeSwitcherProps } from "./ColorModeSwitcher";

export default {
  title: "theme/ColorModeSwitcher",
  component: ColorModeSwitcher,
} as Meta;

const Template: Story<ColorModeSwitcherProps> = (args) => (
  <ColorModeSwitcher {...args} />
);

export const Default = Template.bind({});

Default.storyName = "ColorModeSwitcher";
