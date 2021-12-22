import { IconButton, Link } from "@chakra-ui/react";
import { IconType } from "react-icons/lib";

export interface FooterSocialMediaLinkButtonProps {
  href: string;
  icon: IconType;
  label: string;
}

export const FooterSocialMediaLinkButton = ({
  href,
  icon: Icon,
  label,
}: FooterSocialMediaLinkButtonProps) => (
  <IconButton
    as={Link}
    isExternal
    href={href}
    aria-label={label}
    icon={<Icon fontSize="20px" />}
  />
);
