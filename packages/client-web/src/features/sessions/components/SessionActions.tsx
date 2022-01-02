import {
  ButtonGroup,
  ButtonGroupProps,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { useIntl } from "react-intl";
import { IfAuthorized } from "../../auth/components/IfAuthorized";
import { sessionsApi } from "../sessionsApi";
import { ApiSession } from "../sessionsSchemas";

export interface SessionActionsProps extends ButtonGroupProps {
  onDelete?: () => void;
  session: ApiSession;
}

export const SessionActions = ({
  onDelete,
  session,
  ...props
}: SessionActionsProps) => {
  const { formatMessage } = useIntl();
  const [deleteSession, deleteResult] = sessionsApi.useDeleteSessionMutation();

  return (
    <>
      <ButtonGroup colorScheme="blue" {...props}>
        <IfAuthorized action="delete" subject={session}>
          <IconButton
            aria-label={formatMessage({
              id: "auth.deleteSessionLink.ariaLabel",
              defaultMessage: "Delete Session",
            })}
            icon={<Icon as={FaTrash} />}
            onClick={() => deleteSession(session.id)}
            isLoading={deleteResult.isLoading}
          />
        </IfAuthorized>
      </ButtonGroup>
    </>
  );
};
