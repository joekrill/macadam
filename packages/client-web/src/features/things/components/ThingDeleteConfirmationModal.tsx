import {
  Button,
  chakra,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react";
import { Thing } from "@macadam/api-client";
import { FormattedMessage } from "react-intl";

export interface ThingDeleteConfirmationModalProps
  extends Omit<ModalProps, "children"> {
  thing: Thing;
  onConfirm: () => void;
}

export const ThingDeleteConfirmationModal = ({
  onConfirm,
  thing,
  ...props
}: ThingDeleteConfirmationModalProps) => (
  <Modal {...props}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>
        <FormattedMessage
          id="things.deleteConfirmation.header"
          defaultMessage="Delete Thing?"
        />
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormattedMessage
          id="things.deleteConfirmation.message"
          description="The message asking the user to confirm that they want to delete a Thing"
          defaultMessage="Are you sure you want to delete the Thing ''<e>{name}</e>''?"
          values={{
            name: thing.name,
            e: (chunks) => <chakra.strong>{chunks}</chakra.strong>,
          }}
        />
      </ModalBody>
      <ModalFooter>
        <Button onClick={props.onClose} mr="3">
          <FormattedMessage
            id="things.deleteConfirmation.cancelButton.label"
            defaultMessage="Cancel"
          />
        </Button>
        <Button colorScheme="red" onClick={() => onConfirm()}>
          <FormattedMessage
            id="things.deleteConfirmation.confirmButton.label"
            defaultMessage="Yes, delete it"
          />
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
