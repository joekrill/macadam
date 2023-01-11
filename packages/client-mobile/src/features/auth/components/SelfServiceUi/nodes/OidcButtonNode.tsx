import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Icon } from "native-base";
import { ButtonNode, ButtonNodeProps } from "./ButtonNode";

interface OidcButtonConfig {
  iconName: React.ComponentProps<typeof FontAwesome5>["name"];
  colorScheme: ButtonNodeProps["colorScheme"];
}

const OIDC_CONFIGS: Record<string, OidcButtonConfig> = {
  default: {
    iconName: "sign-in-alt",
    colorScheme: "gray",
  },
  discord: {
    iconName: "discord",
    colorScheme: "purple",
  },
  facebook: {
    iconName: "facebook",
    colorScheme: "blueGray",
  },
  github: {
    iconName: "github",
    colorScheme: "cyan",
  },
  google: {
    iconName: "google",
    colorScheme: "red",
  },
  microsoft: {
    iconName: "microsoft",
    colorScheme: "blue",
  },
  twitch: {
    iconName: "twitch",
    colorScheme: "darkBlue",
  },
};

export interface OidcButtonNodeProps extends ButtonNodeProps {}

export const OidcButtonNode = (props: OidcButtonNodeProps) => {
  const provider = (props.node.meta.label?.context as any)?.provider;
  const { iconName, colorScheme } =
    OIDC_CONFIGS[provider] || (OIDC_CONFIGS.default as OidcButtonConfig);

  return (
    <ButtonNode
      {...props}
      leftIcon={
        <Icon
          as={<FontAwesome5 name={iconName} size={5} />}
          colorScheme={colorScheme}
        />
      }
    />
  );
};
