import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { Global } from "@emotion/react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Route, Switch } from "react-router-dom";
import { Footer } from "../features/common/components/Footer/Footer";
import { Header } from "../features/common/components/Header/Header";
import { CrashInitiator } from "../features/errors/components/CrashInitiator/CrashInitiator";
import { NotFoundPage } from "../features/errors/components/NotFoundPage/NotFoundPage";
import { Auth } from "../features/identity/components/Auth";
import { AuthenticatedRoute } from "../features/identity/components/AuthenticatedRoute";
import { ContactUs } from "../features/pages/ContactUs/ContactUs";
import { Faq } from "../features/pages/Faq/Faq";
import { Home } from "../features/pages/Home/Home";
import { PrivacyPolicy } from "../features/pages/PrivacyPolicy/PrivacyPolicy";
import { TermsOfService } from "../features/pages/TermsOfService/TermsOfService";

export const App = () => {
  const { colorMode } = useColorMode();

  return (
    <HelmetProvider>
      <Helmet
        titleTemplate={`%s - ${process.env.REACT_APP_DISPLAY_NAME}`}
        defaultTitle={process.env.REACT_APP_DISPLAY_NAME}
      />
      <Global
        // Take from the solution used here: https://github.com/postcss/postcss-100vh-fix
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
        <Box bg={colorMode === "dark" ? "gray.900" : "gray.100"} flex={1}>
          <Switch>
            <Route path="/auth">
              <Auth />
            </Route>
            <Route path="/contact" exact>
              <ContactUs />
            </Route>
            <Route path="/faq" exact>
              <Faq />
            </Route>
            <Route path="/privacy" exact>
              <PrivacyPolicy />
            </Route>
            <Route path="/terms" exact>
              <TermsOfService />
            </Route>
            <Route path="/crash">
              <CrashInitiator />
            </Route>
            <AuthenticatedRoute path="/user/profile">
              TODO: user profile!
            </AuthenticatedRoute>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route>
              <NotFoundPage />
            </Route>
          </Switch>
        </Box>
        <Footer />
      </Flex>
    </HelmetProvider>
  );
};
