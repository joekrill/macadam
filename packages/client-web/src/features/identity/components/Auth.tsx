import { Helmet } from "react-helmet-async";
import { Route, Switch } from "react-router-dom";
import { Login } from "./Login";
import { Recovery } from "./Recovery";
import { Register } from "./Register";
import { Settings } from "./Settings";
import { Verification } from "./Verification";

export const Auth = () => (
  <>
    <Helmet
      titleTemplate={`%s - ${process.env.REACT_APP_NAME}`}
      defaultTitle={process.env.REACT_APP_NAME}
    />

    <Switch>
      <Route path="/auth/login">
        <Login />
      </Route>
      <Route path="/auth/registration">
        <Register />
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
      <Route>Something went wrong :(</Route>
    </Switch>
  </>
);
