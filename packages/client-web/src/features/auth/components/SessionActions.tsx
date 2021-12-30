import {
  ButtonGroup,
  ButtonGroupProps,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { useIntl } from "react-intl";
import { authApi } from "../authApi";
import { SessionWithoutIdentity } from "../schemas/session";
import { IfAuthorized } from "./IfAuthorized";

export interface SessionActionsProps extends ButtonGroupProps {
  onDelete?: () => void;
  session: SessionWithoutIdentity;
}

export const SessionActions = ({
  onDelete,
  session,
  ...props
}: SessionActionsProps) => {
  const { formatMessage } = useIntl();
  const [deleteSession, deleteResult] = authApi.useDeleteSessionMutation();

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
