import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { Global } from "@emotion/react";
import {
  selectPendingVerifiableAddresses,
  useSession,
} from "@macadam/api-client";
import { Route } from "react-router-dom";
import { LoginModal } from "../features/auth/components/flows/login/LoginModal";
import { VerifyEmailNotificationBanner } from "../features/auth/components/VerifyEmailNotificationBanner/VerifyEmailNotificationBanner";
import { FlowErrorPage } from "../features/auth/pages/FlowErrorPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RecoveryPage } from "../features/auth/pages/RecoveryPage";
import { RegistrationPage } from "../features/auth/pages/RegistrationPage";
import { VerificationPage } from "../features/auth/pages/VerificationPage";
import { CrashInitiator } from "../features/errors/components/CrashInitiator/CrashInitiator";
import { NotFoundPage } from "../features/errors/components/NotFoundPage/NotFoundPage";
import { Routes } from "../features/routing/components/Routes";
import { SettingsPage } from "../features/settings/pages/SettingsPage";
import { ThingsPage } from "../features/things/components/ThingsPage";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { useAppSelector } from "./hooks";
import { ContactUs } from "./pages/ContactUs/ContactUs";
import { Faq } from "./pages/Faq/Faq";
import { Home } from "./pages/Home/Home";
import { PrivacyPolicy } from "./pages/PrivacyPolicy/PrivacyPolicy";
import { TermsAndConditions } from "./pages/TermsAndConditions/TermsAndConditions";

/**
 * Renders the main content of the app (excluding main app context providers)
 *
 * Sticky footer technique taken from: {@url https://css-tricks.com/a-clever-sticky-footer-technique/}
 */
export const AppContent = () => {
  const { colorMode } = useColorMode();
  const session = useSession();
  const pendingVerifiableAddresses = useAppSelector((s) =>
    selectPendingVerifiableAddresses(s)
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
        <Box
          bg={colorMode === "dark" ? "gray.900" : "gray.50"}
          flex={1}
          px={{ base: "2", sm: "4" }}
          pt="6"
          pb="12"
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<RegistrationPage />} />
            <Route path="/auth/error" element={<FlowErrorPage />} />
            <Route path="/account/verify" element={<VerificationPage />} />
            <Route path="/account/recover" element={<RecoveryPage />} />
            <Route path="/settings/*" element={<SettingsPage />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/crash" element={<CrashInitiator />} />
            <Route path="/things/*" element={<ThingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Box>
        <Footer position="sticky" top="100vh" />
      </Flex>
    </>
  );
};
