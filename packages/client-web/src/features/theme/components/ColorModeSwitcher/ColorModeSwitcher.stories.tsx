import { ColorMode, DarkMode, LightMode } from "@chakra-ui/react";
import { Meta, Story } from "@storybook/react";
import { ColorModeSwitcher, ColorModeSwitcherProps } from "./ColorModeSwitcher";

export default {
  title: "Theme/ColorModeSwitcher",
  component: ColorModeSwitcher,
  argTypes: {
    colorMode: {
      control: { type: "inline-radio" },
      defaultValue: "(context)",
      description: "The current mode",
      mapping: {
        "(context)": undefined,
      },
      options: ["(context)", "light", "dark"],
    },
    onClick: { action: "clicked", table: { disable: true } },
  },
} as Meta;

interface StoryProps extends ColorModeSwitcherProps {
  colorMode?: ColorMode;
}

const Template: Story<StoryProps> = ({ colorMode, ...props }) => {
  // This prevents "flashing" of the screen when clicking because otherwise
  // there is a brief switch to the next color mode, which is quickly reverted.
  const { onClick } = props;
  props.onClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    e.preventDefault();
  };

  switch (colorMode) {
    case "dark": {
      return (
        <DarkMode>
          <ColorModeSwitcher {...props} />
        </DarkMode>
      );
    }
    case "light": {
      return (
        <LightMode>
          <ColorModeSwitcher {...props} />
        </LightMode>
      );
    }
    default: {
      return <ColorModeSwitcher {...props} />;
    }
  }
};

export const Default = Template.bind({});

Default.storyName = "ColorModeSwitcher";
