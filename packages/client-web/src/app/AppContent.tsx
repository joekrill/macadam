import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { Global } from "@emotion/react";
import { Route, Routes } from "react-router-dom";
import { RequireAuthenticated } from "../features/auth/components/RequireAuthenticated";
import { AuthPage } from "../features/auth/pages/AuthPage";
import { SettingsPage } from "../features/auth/pages/SettingsPage";
import { CrashInitiator } from "../features/errors/components/CrashInitiator/CrashInitiator";
import { NotFoundPage } from "../features/errors/components/NotFoundPage/NotFoundPage";
import { ContactUs } from "../features/pages/ContactUs/ContactUs";
import { Faq } from "../features/pages/Faq/Faq";
import { Home } from "../features/pages/Home/Home";
import { PrivacyPolicy } from "../features/pages/PrivacyPolicy/PrivacyPolicy";
import { TermsAndConditions } from "../features/pages/TermsAndConditions/TermsAndConditions";
import { ThingsPage } from "../features/things/components/ThingsPage";
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
          bg={colorMode === "dark" ? "gray.900" : "gray.100"}
          flex={1}
          px={{ base: "2", sm: "4" }}
          py="5"
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth/*" element={<AuthPage />} />
            <Route
              path="/settings"
              element={
                <RequireAuthenticated>
                  <SettingsPage />
                </RequireAuthenticated>
              }
            />
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
