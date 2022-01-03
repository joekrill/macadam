import { Container } from "@chakra-ui/react";
import { Card } from "../../common/components/Card/Card";
import { AppPreferences } from "../components/AppPreferences/AppPreferences";

export const SettingsPageUnauthenticated = () => (
  <Container as="section" maxW="container.sm">
    <AppPreferences as={Card} />
  </Container>
);
