import { FlowErrorPage } from "../features/auth/pages/FlowErrorPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RecoveryPage } from "../features/auth/pages/RecoveryPage";
import { RegistrationPage } from "../features/auth/pages/RegistrationPage";
import { VerificationPage } from "../features/auth/pages/VerificationPage";
import { CrashInitiator } from "../features/errors/components/CrashInitiator/CrashInitiator";
import { NotFoundPage } from "../features/errors/components/NotFoundPage/NotFoundPage";
import { settingsRoutes } from "../features/settings/settingsRoutes";
import { thingsRoutes } from "../features/things/thingsRoutes";
import { AppLayout } from "./AppLayout";
import { ContactUs } from "./pages/ContactUs/ContactUs";
import { Faq } from "./pages/Faq/Faq";
import { Home } from "./pages/Home/Home";
import { PrivacyPolicy } from "./pages/PrivacyPolicy/PrivacyPolicy";
import { TermsAndConditions } from "./pages/TermsAndConditions/TermsAndConditions";

export const routes = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <RegistrationPage />,
      },
      {
        path: "/auth/error",
        element: <FlowErrorPage />,
      },
      {
        path: "/account/verify",
        element: <VerificationPage />,
      },
      {
        path: "/account/recover",
        element: <RecoveryPage />,
      },
      {
        path: "/contact",
        element: <ContactUs />,
      },
      {
        path: "/faq",
        element: <Faq />,
      },
      {
        path: "/privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms",
        element: <TermsAndConditions />,
      },
      ...thingsRoutes,
      ...settingsRoutes,
      ...(process.env.NODE_ENV !== "production"
        ? [
            {
              path: "/crash",
              element: <CrashInitiator />,
            },
          ]
        : []),
      {
        element: <NotFoundPage />,
      },
    ],
  },
];
