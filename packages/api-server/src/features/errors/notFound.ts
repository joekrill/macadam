import httpErrors from "http-errors";

export const notFound = () => () => {
  throw new httpErrors.NotFound();
};
