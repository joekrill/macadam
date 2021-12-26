import {
  ButtonGroup,
  ButtonGroupProps,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { FaPen } from "react-icons/fa";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { IfAuthorized } from "../../auth/components/IfAuthorized";
import { RouterLink } from "../../routing/components/RouterLink";
import { Thing } from "../thingsSchemas";

export interface ThingActionsProps extends ButtonGroupProps {
  thing: Thing;
}

export const ThingActions = ({ thing, ...props }: ThingActionsProps) => {
  const location = useLocation();
  const { formatMessage } = useIntl();

  return (
    <ButtonGroup colorScheme="blue" {...props}>
      <IfAuthorized action="update" subject={thing}>
        <IconButton
          aria-label={formatMessage({
            id: "things.editThingLink.ariaLabel",
            defaultMessage: "Edit Thing",
          })}
          as={RouterLink}
          icon={<Icon as={FaPen} />}
          to={`/things/${thing.id}/edit`}
          state={{ returnTo: location }}
        />
      </IfAuthorized>
    </ButtonGroup>
  );
};
