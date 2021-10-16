import { Box } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { Route, Switch } from "react-router-dom";
import { NotFoundPage } from "../../errors/components/NotFoundPage/NotFoundPage";
import { Login } from "./Login";
import { Recovery } from "./Recovery";
import { Registration } from "./Registration";
import { Settings } from "./Settings";
import { Verification } from "./Verification";

export const Auth = () => (
  <Box p={5}>
    <Helmet
      titleTemplate={`%s - ${process.env.REACT_APP_DISPLAY_NAME}`}
      defaultTitle={process.env.REACT_APP_DISPLAY_NAME}
    />

    <Switch>
      <Route path="/auth/login">
        <Login />
      </Route>
      <Route path="/auth/registration">
        <Registration />
      </Route>
      <Route path="/auth/recovery">
        <Recovery />
      </Route>
      <Route path="/auth/settings">
        <Settings />
      </Route>
      <Route path="/auth/verification">
        <Verification />
      </Route>
      <Route>
        <NotFoundPage />
      </Route>
    </Switch>
  </Box>
);
