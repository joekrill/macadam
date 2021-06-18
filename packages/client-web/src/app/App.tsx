import { Box, Heading, useColorMode } from "@chakra-ui/react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Route, Switch } from "react-router-dom";
import { Footer } from "../features/common/components/Footer";
import { Header } from "../features/common/components/Header";
import { NotFound } from "../features/common/pages/NotFound";
import { Auth } from "../features/identity/components/Auth";

export const App = () => {
  const { colorMode } = useColorMode();

  return (
    <HelmetProvider>
      <Helmet
        titleTemplate={`%s - ${process.env.REACT_APP_NAME}`}
        defaultTitle={process.env.REACT_APP_NAME}
      />
      <Header position="sticky" top="0px" zIndex="sticky" />
      <Box
        textAlign="center"
        fontSize="xl"
        bg={colorMode === "dark" ? "gray.900" : "gray.100"}
        minH="120vh"
      >
        <Switch>
          <Route path="/auth">
            <Auth />
          </Route>
          <Route path="/" exact>
            <Heading>This is home!</Heading>
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Box>
      <Footer />
    </HelmetProvider>
  );
};
