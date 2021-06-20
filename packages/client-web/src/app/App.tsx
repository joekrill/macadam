import { Box, Flex, Heading, useColorMode } from "@chakra-ui/react";
import { Global } from "@emotion/react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Route, Switch } from "react-router-dom";
import { Footer } from "../features/common/components/Footer/Footer";
import { Header } from "../features/common/components/Header";
import { ContactUs } from "../features/common/pages/ContactUs";
import { NotFound } from "../features/common/pages/NotFound";
import { PrivacyPolicy } from "../features/common/pages/PrivacyPolicy";
import { TermsOfService } from "../features/common/pages/TermsOfService";
import { Auth } from "../features/identity/components/Auth";

export const App = () => {
  const { colorMode } = useColorMode();

  return (
    <HelmetProvider>
      <Helmet
        titleTemplate={`%s - ${process.env.REACT_APP_NAME}`}
        defaultTitle={process.env.REACT_APP_NAME}
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
            <Route path="/privacy" exact>
              <PrivacyPolicy />
            </Route>
            <Route path="/terms" exact>
              <TermsOfService />
            </Route>
            <Route path="/" exact>
              <Heading>This is the home page</Heading>
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </Box>
        <Footer />
      </Flex>
    </HelmetProvider>
  );
};
