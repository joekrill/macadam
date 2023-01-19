import { RouteObject } from "react-router-dom";
import { RequireAuthenticated } from "../auth/components/RequireAuthenticated";
import { ProfileSettingsPage } from "../auth/pages/ProfileSettingsPage";
import { Card } from "../common/components/Card/Card";
import { SessionsList } from "../sessions/components/SessionsList";
import { AppPreferences } from "./components/AppPreferences/AppPreferences";
import { SettingsPageLayout } from "./components/SettingsPageLayout";

export const settingsRoutes: RouteObject[] = [
  {
    path: "/settings",
    element: <SettingsPageLayout />,
    children: [
      {
        path: "sessions",
        element: (
          <RequireAuthenticated>
            <SessionsList />
          </RequireAuthenticated>
        ),
      },
      {
        path: "profile",
        element: (
          <RequireAuthenticated>
            <ProfileSettingsPage />
          </RequireAuthenticated>
        ),
      },
      {
        path: "",
        element: <AppPreferences as={Card} />,
      },
    ],
  },
];
