import { Box, Grid, Heading, HStack, Link } from "@chakra-ui/react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link as RouterLink, Route, Switch } from "react-router-dom";
import { Auth } from "../features/auth/Auth";
import { ColorModeSwitcher } from "../features/theme/components/ColorModeSwitcher";
import { selfServiceApi } from "../services/selfService";

export const App = () => {
  const whoami = selfServiceApi.useWhoamiQuery();
  const identity =
    // @ts-ignore
    whoami.data?.identity.traits["email"] || whoami.data?.identity.id;

  return (
    <HelmetProvider>
      <Helmet
        titleTemplate={`%s - ${process.env.REACT_APP_NAME}`}
        defaultTitle={process.env.REACT_APP_NAME}
      />
      <Box textAlign="center" fontSize="xl">
        <Heading>
          {process.env.REACT_APP_NAME} v{process.env.REACT_APP_VERSION}
        </Heading>
        <div>You are: {identity}</div>
        <HStack spacing={8}>
          <Link as={RouterLink} color="teal.500" to="/auth/login">
            Login
          </Link>
          <Link as={RouterLink} color="teal.500" to="/auth/registration">
            Register
          </Link>
          <Link as={RouterLink} color="teal.500" to="/auth/recovery">
            Recover
          </Link>
          <Link as={RouterLink} color="teal.500" to="/auth/verification">
            Verify
          </Link>
          <Link as={RouterLink} color="teal.500" to="/auth/settings">
            Settings
          </Link>
          <Link color="teal.500" href="/self-service/browser/flows/logout">
            Logout
          </Link>
        </HStack>
        <Switch>
          <Route path="/auth">
            <Auth />
          </Route>
          <Route path="/hello">
            Hello!
            <Link as={RouterLink} to="/">
              Go to default
            </Link>
          </Route>
          <Route>
            Default route!
            <Link as={RouterLink} to="/hello">
              Go to hello
            </Link>
          </Route>
        </Switch>
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
        </Grid>
      </Box>
    </HelmetProvider>
  );
};
