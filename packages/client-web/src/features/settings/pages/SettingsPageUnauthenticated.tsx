import { Container } from "@chakra-ui/react";
import { AppPreferences } from "../components/AppPreferences/AppPreferences";

export const SettingsPageUnauthenticated = () => (
  <Container as="section" maxW="container.lg">
    <AppPreferences />
  </Container>
);
