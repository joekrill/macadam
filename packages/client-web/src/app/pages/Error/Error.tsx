import { ensure } from "errorish";
import { useRouteError } from "react-router-dom";
import { z } from "zod";
import { NotFoundPage } from "../../../features/errors/components/NotFoundPage/NotFoundPage";
import { UnexpectedErrorPage } from "../../../features/errors/components/UnexpectedErrorPage/UnexpectedErrorPage";

const errorNotFoundSchema = z.object({ status: z.literal(404) });

export const Error = () => {
  const error = useRouteError();
  // console.error(error);

  if (errorNotFoundSchema.safeParse(error).success) {
    return <NotFoundPage />;
  }

  return (
    <UnexpectedErrorPage
      componentStack={null}
      error={ensure(error)}
      eventId={null}
    />
  );
};
