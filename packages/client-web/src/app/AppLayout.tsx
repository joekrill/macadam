import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { Global } from "@emotion/react";
import {
  selectPendingVerifiableAddresses,
  useSession,
} from "@macadam/api-client";
import { Outlet } from "react-router-dom";
import { VerifyEmailNotificationBanner } from "../features/auth/components/VerifyEmailNotificationBanner/VerifyEmailNotificationBanner";
import { LoginModal } from "../features/auth/components/flows/login/LoginModal";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { useAppSelector } from "./hooks";

/**
 * Renders the main content of the app (excluding main app context providers)
 *
 * Sticky footer technique taken from: {@url https://css-tricks.com/a-clever-sticky-footer-technique/}
 */
export const AppLayout = () => {
  const { colorMode } = useColorMode();
  const session = useSession();
  const pendingVerifiableAddresses = useAppSelector((s) =>
    selectPendingVerifiableAddresses(s),
  );

  return (
    <>
      <Global styles={`html, body { height: 100%;}`} />
      {session.authState === "session_aal2_required" && (
        <LoginModal aal="aal2" isOpen onClose={() => {}} />
      )}
      {session.authState === "session_refresh_required" && (
        <LoginModal refresh isOpen onClose={() => {}} />
      )}
      <Flex
        direction="column"
        bg={colorMode === "dark" ? "gray.900" : "gray.50"}
        sx={{
          minHeight: "100vh",
          "@supports (-webkit-touch-callout: none)": {
            minHeight: "-webkit-fill-available",
          },
        }}
      >
        {pendingVerifiableAddresses.length > 0 && (
          <VerifyEmailNotificationBanner
            emailAddress={pendingVerifiableAddresses[0]!.value}
          />
        )}
        <Header position="sticky" top="0px" zIndex="sticky" />
        <Box flex={1} px={{ base: "2", sm: "4" }} pt="6" pb="12">
          <Outlet />
        </Box>
        <Footer position="sticky" top="100vh" />
      </Flex>
    </>
  );
};
