import { Container } from "@chakra-ui/react";
import { Route, Switch } from "react-router-dom";
import { ThingDetails } from "./ThingDetails";
import { ThingsList } from "./ThingsList";

export const ThingsPage = () => (
  <Container maxW="container.lg">
    <Switch>
      <Route path="/things/:id">
        <ThingDetails />
      </Route>
      <Route path="/things">
        <ThingsList />
      </Route>
    </Switch>
  </Container>
);
