import {
  Box,
  Button,
  Code,
  Grid,
  Heading,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link as RouterLink, Route, Switch } from "react-router-dom";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { Auth } from "../features/auth/Auth";
import { selfServiceApi } from "./services/selfService";

export const App = () => {
  const result = selfServiceApi.useWhoamiQuery();

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
        <div>You are: {result.data?.id}</div>
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={8}>
            <Text>
              Edit <Code fontSize="xl">src/App.tsx</Code> and save to reload.
            </Text>
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
            <Link color="teal.500" to="/self-service/browser/flows/logout">
              Logout
            </Link>
            <Button colorScheme="blue">A button</Button>
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
          </VStack>
        </Grid>
      </Box>
    </HelmetProvider>
  );
};
