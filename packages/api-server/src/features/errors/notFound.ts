import { NotFound } from "http-errors";

export const notFound = () => () => {
  throw new NotFound();
};
