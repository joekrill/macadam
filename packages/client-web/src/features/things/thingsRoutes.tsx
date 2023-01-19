import { Container } from "@chakra-ui/react";
import { Outlet, RouteObject } from "react-router-dom";
import { RequireAuthenticated } from "../auth/components/RequireAuthenticated";
import { ThingCreate } from "./components/ThingCreate";
import { ThingDetails } from "./components/ThingDetails";
import { ThingEdit } from "./components/ThingEdit";
import { ThingsList } from "./components/ThingsList";

export const thingsRoutes: RouteObject[] = [
  {
    path: "/things",
    element: (
      <Container maxW="container.lg">
        <Outlet />
      </Container>
    ),
    children: [
      {
        path: ":id",
        element: <ThingDetails />,
      },
      {
        path: ":id/edit",
        element: (
          <RequireAuthenticated>
            <ThingEdit />
          </RequireAuthenticated>
        ),
      },
      {
        path: "new",
        element: (
          <RequireAuthenticated>
            <ThingCreate />
          </RequireAuthenticated>
        ),
      },
      {
        path: "",
        element: <ThingsList />,
      },
    ],
  },
];
