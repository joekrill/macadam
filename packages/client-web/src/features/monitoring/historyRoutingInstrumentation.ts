import { BrowserTracingOptions } from "@sentry/tracing/dist/browser/browsertracing";
import { History } from "history";

type RoutingInstrumentation = BrowserTracingOptions["routingInstrumentation"];

type CustomStartTransaction = Parameters<RoutingInstrumentation>[0];

type Transaction = ReturnType<CustomStartTransaction>;

type Tags = Parameters<CustomStartTransaction>[0]["tags"];

export const historyRoutingInstrumentation = (history: History) => {
  let activeTransaction: Transaction | undefined;

  const tags: Tags = {
    "routing.instrumentation": "history-v5",
  };

  // TODO: figure out how to use the parameterized route for the transaction
  // name (i.e. `/things/:id` instead of `/things/12312312`)
  // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/#parameterized-transaction-names

  const routingInstrumentation: RoutingInstrumentation = (
    customStartTransaction,
    startTransactionOnPageLoad = true,
    startTransactionOnLocationChange = true
  ) => {
    if (startTransactionOnPageLoad) {
      activeTransaction = customStartTransaction({
        name: history.location.pathname,
        op: "pageload",
        tags,
      });
    }

    if (startTransactionOnLocationChange && history.listen) {
      history.listen(({ action, location }) => {
        if (action === "PUSH" || action === "POP") {
          activeTransaction?.finish();

          activeTransaction = customStartTransaction({
            name: location.pathname,
            op: "navigation",
            tags,
          });
        }
      });
    }
  };

  return routingInstrumentation;
};
