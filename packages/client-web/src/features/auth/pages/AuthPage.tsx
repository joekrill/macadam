import { Box } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { Route, Switch } from "react-router-dom";
import { NotFoundPage } from "../../errors/components/NotFoundPage/NotFoundPage";
import { LoginPage } from "./LoginPage";
import { RecoveryPage } from "./RecoveryPage";
import { RegistrationPage } from "./RegistrationPage";
import { SettingsPage } from "./SettingsPage";
import { VerificationPage } from "./VerificationPage";

export const AuthPage = () => (
  <Box p={5}>
    <Helmet
      titleTemplate={`%s - ${process.env.REACT_APP_DISPLAY_NAME}`}
      defaultTitle={process.env.REACT_APP_DISPLAY_NAME}
    />

    <Switch>
      <Route path="/auth/login">
        <LoginPage />
      </Route>
      <Route path="/auth/registration">
        <RegistrationPage />
      </Route>
      <Route path="/auth/verification">
        <VerificationPage />
      </Route>
      <Route path="/auth/recovery">
        <RecoveryPage />
      </Route>
      <Route path="/auth/settings">
        <SettingsPage />
      </Route>
      <Route>
        <NotFoundPage />
      </Route>
    </Switch>
  </Box>
);
