import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { Global } from "@emotion/react";
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RecoveryPage } from "../features/auth/pages/RecoveryPage";
import { RegistrationPage } from "../features/auth/pages/RegistrationPage";
import { VerificationPage } from "../features/auth/pages/VerificationPage";
import { CrashInitiator } from "../features/errors/components/CrashInitiator/CrashInitiator";
import { NotFoundPage } from "../features/errors/components/NotFoundPage/NotFoundPage";
import { ContactUs } from "../features/pages/ContactUs/ContactUs";
import { Faq } from "../features/pages/Faq/Faq";
import { Home } from "../features/pages/Home/Home";
import { PrivacyPolicy } from "../features/pages/PrivacyPolicy/PrivacyPolicy";
import { TermsAndConditions } from "../features/pages/TermsAndConditions/TermsAndConditions";
import { ThingsPage } from "../features/things/components/ThingsPage";
import { UserSettingsPage } from "../features/users/pages/UserSettingsPage";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";

export const AppContent = () => {
  const { colorMode } = useColorMode();

  return (
    <>
      <Global
        // Taken from the solution used here: https://github.com/postcss/postcss-100vh-fix
        styles={`
          body, #root {
            min-height: 100vh;
          }
          @supports (-webkit-touch-callout: none) {
            body, #root {
              min-height: -webkit-fill-available;
            }  
          }
        `}
      />
      <Flex
        direction="column"
        sx={{
          minHeight: "100vh",
          "@supports (-webkit-touch-callout: none)": {
            minHeight: "-webkit-fill-available",
          },
        }}
      >
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
            <Route path="/account/verify" element={<VerificationPage />} />
            <Route path="/account/recover" element={<RecoveryPage />} />
            <Route path="/settings/*" element={<UserSettingsPage />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/crash" element={<CrashInitiator />} />
            <Route path="/things/*" element={<ThingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Box>
        <Footer />
      </Flex>
    </>
  );
};
