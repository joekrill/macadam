import { ButtonGroup, ButtonGroupProps } from "@chakra-ui/react";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { FooterSocialMediaLinkButton } from "./FooterSocialMediaLinkButton";

export const FooterSocialMediaLinks = (props: ButtonGroupProps) => (
  <ButtonGroup variant="outline" colorScheme="gray" {...props}>
    {process.env.VITE_URL_GITHUB && (
      <FooterSocialMediaLinkButton
        href={process.env.VITE_URL_GITHUB}
        label="Github"
        icon={FaGithub}
      />
    )}
    {process.env.VITE_URL_INSTAGRAM && (
      <FooterSocialMediaLinkButton
        href={process.env.VITE_URL_INSTAGRAM}
        label="Instagram"
        icon={FaInstagram}
      />
    )}
    {process.env.VITE_URL_LINKEDIN && (
      <FooterSocialMediaLinkButton
        href={process.env.VITE_URL_LINKEDIN}
        label="LinkedIn"
        icon={FaLinkedin}
      />
    )}
    {process.env.VITE_URL_TWITTER && (
      <FooterSocialMediaLinkButton
        href={process.env.VITE_URL_TWITTER}
        label="Twitter"
        icon={FaTwitter}
      />
    )}
  </ButtonGroup>
);
