import {
  forwardRef,
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";
import {
  Link as ReactRouterLink,
  LinkProps as ReactRouterLinkProps,
} from "react-router-dom";

export interface RouterLinkProps
  extends ChakraLinkProps,
    Pick<ReactRouterLinkProps, "to" | "replace" | "state"> {}

export const RouterLink = forwardRef<RouterLinkProps, "a">((props, ref) => (
  <ChakraLink ref={ref} {...props} as={ReactRouterLink} />
));
