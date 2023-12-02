import {
  ButtonGroup,
  ButtonGroupProps,
  Icon,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Thing, thingsApi } from "@macadam/api-client";
import { useCallback } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { IfAuthorized } from "../../auth/components/IfAuthorized";
import { RouterLink } from "../../routing/components/RouterLink";
import { ThingDeleteConfirmationModal } from "./ThingDeleteConfirmationModal";

export interface ThingActionsProps extends ButtonGroupProps {
  onDelete?: () => void;
  thing: Thing;
}

export const ThingActions = ({
  onDelete,
  thing,
  ...props
}: ThingActionsProps) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { formatMessage } = useIntl();
  const location = useLocation();
  const [deleteThing, deleteResult] = thingsApi.useDeleteThingMutation();
  const id = thing.id;

  const confirmDeleteThing = useCallback(() => {
    onClose();
    deleteThing(id).then(onDelete);
  }, [deleteThing, id, onClose, onDelete]);

  return (
    <>
      <ButtonGroup colorScheme="blue" {...props}>
        <IfAuthorized action="update" subject={thing}>
          <IconButton
            aria-label={formatMessage({
              id: "things.editThingLink.ariaLabel",
              description:
                "The accessible text to apply to the button used to edit a Thing",
              defaultMessage: "Edit Thing",
            })}
            as={RouterLink}
            icon={<Icon as={FaPen} />}
            to={`/things/${thing.id}/edit`}
            state={{ returnTo: location }}
            disabled={deleteResult.isLoading}
          />
        </IfAuthorized>
        <IfAuthorized action="delete" subject={thing}>
          <IconButton
            aria-label={formatMessage({
              id: "things.deleteThingLink.ariaLabel",
              description:
                "The accessible text to apply to the button used to delete a Thing",
              defaultMessage: "Delete Thing",
            })}
            icon={<Icon as={FaTrash} />}
            onClick={onOpen}
            isLoading={deleteResult.isLoading}
          />
        </IfAuthorized>
      </ButtonGroup>
      <ThingDeleteConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={confirmDeleteThing}
        thing={thing}
      />
    </>
  );
};
