import { Container } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import { ThingCreate } from "./ThingCreate";
import { ThingDetails } from "./ThingDetails";
import { ThingEdit } from "./ThingEdit";
import { ThingsList } from "./ThingsList";

export const ThingsPage = () => (
  <Container maxW="container.lg">
    <Routes>
      <Route path=":id" element={<ThingDetails />} />
      <Route path=":id/edit" element={<ThingEdit />} />
      <Route path="new" element={<ThingCreate />} />
      <Route path="*" element={<ThingsList />} />
    </Routes>
  </Container>
);
