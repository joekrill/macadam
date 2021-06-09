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
import { ColorModeSwitcher } from "./ColorModeSwitcher";

export const App = () => (
  <HelmetProvider>
    <Helmet
      titleTemplate={`%s - ${process.env.REACT_APP_NAME}`}
      defaultTitle={process.env.REACT_APP_NAME}
    />
    <Box textAlign="center" fontSize="xl">
      <Heading>
        {process.env.REACT_APP_NAME} v{process.env.REACT_APP_VERSION}
      </Heading>
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <VStack spacing={8}>
          <Text>
            Edit <Code fontSize="xl">src/App.tsx</Code> and save to reload.
          </Text>
          <Link
            color="teal.500"
            href="https://chakra-ui.com"
            fontSize="2xl"
            isExternal
          >
            Learn Chakra
          </Link>
          <Button colorScheme="blue">A button</Button>
          <Switch>
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
