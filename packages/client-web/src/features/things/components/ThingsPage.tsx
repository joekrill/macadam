import { Container } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import { ThingDetails } from "./ThingDetails";
import { ThingsList } from "./ThingsList";

export const ThingsPage = () => (
  <Container maxW="container.lg">
    <Routes>
      <Route path=":id" element={<ThingDetails />} />
      <Route path="*" element={<ThingsList />} />
    </Routes>
  </Container>
);
