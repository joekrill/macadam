import { Container } from "@chakra-ui/react";
import { Route } from "react-router-dom";
import { RequireAuthenticated } from "../../auth/components/RequireAuthenticated";
import { Routes } from "../../routing/components/Routes";
import { ThingCreate } from "./ThingCreate";
import { ThingDetails } from "./ThingDetails";
import { ThingEdit } from "./ThingEdit";
import { ThingsList } from "./ThingsList";

export const ThingsPage = () => (
  <Container maxW="container.lg">
    <Routes>
      <Route path=":id" element={<ThingDetails />} />
      <Route
        path=":id/edit"
        element={
          <RequireAuthenticated>
            <ThingEdit />
          </RequireAuthenticated>
        }
      />
      <Route
        path="new"
        element={
          <RequireAuthenticated>
            <ThingCreate />
          </RequireAuthenticated>
        }
      />
      <Route path="*" element={<ThingsList />} />
    </Routes>
  </Container>
);
