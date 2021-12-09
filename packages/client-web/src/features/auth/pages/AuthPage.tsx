import { Box } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { Route, Routes } from "react-router-dom";
import { NotFoundPage } from "../../errors/components/NotFoundPage/NotFoundPage";
import { LoginPage } from "./LoginPage";
import { RecoveryPage } from "./RecoveryPage";
import { RegistrationPage } from "./RegistrationPage";
import { SettingsPage } from "./SettingsPage";
import { VerificationPage } from "./VerificationPage";

export const AuthPage = () => (
  <Box>
    <Helmet
      titleTemplate={`%s - ${process.env.REACT_APP_DISPLAY_NAME}`}
      defaultTitle={process.env.REACT_APP_DISPLAY_NAME}
    />

    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="registration" element={<RegistrationPage />} />
      <Route path="verification" element={<VerificationPage />} />
      <Route path="recovery" element={<RecoveryPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route element={<NotFoundPage />} />
    </Routes>
  </Box>
);
