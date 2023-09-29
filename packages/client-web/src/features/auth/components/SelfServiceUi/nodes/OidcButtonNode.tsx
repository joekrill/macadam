import {
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaGoogle,
  FaMicrosoft,
  FaSignInAlt,
  FaTwitch,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";
import { ButtonNode, ButtonNodeProps } from "./ButtonNode";

interface OidcButtonConfig {
  Icon: IconType;
  colorScheme: ButtonNodeProps["colorScheme"];
}

const OIDC_CONFIGS: Record<string, OidcButtonConfig> = {
  default: {
    Icon: FaSignInAlt,
    colorScheme: "gray",
  },
  xdiscord: {
    Icon: FaDiscord,
    colorScheme: "purple",
  },
  facebook: {
    Icon: FaFacebook,
    colorScheme: "facebook",
  },
  github: {
    Icon: FaGithub,
    colorScheme: "cyan",
  },
  google: {
    Icon: FaGoogle,
    colorScheme: "red",
  },
  microsoft: {
    Icon: FaMicrosoft,
    colorScheme: "blue",
  },
  twitch: {
    Icon: FaTwitch,
    colorScheme: "twitter",
  },
};

export interface OidcButtonNodeProps extends ButtonNodeProps {}

type ContextType = { provider: keyof typeof OIDC_CONFIGS } | undefined;

export const OidcButtonNode = (props: OidcButtonNodeProps) => {
  const provider = (props.node.meta.label?.context as ContextType)?.provider;
  const { Icon, colorScheme } =
    OIDC_CONFIGS[provider || "default"] ||
    (OIDC_CONFIGS.default as OidcButtonConfig);

  return (
    <ButtonNode {...props} leftIcon={<Icon />} colorScheme={colorScheme} />
  );
};
