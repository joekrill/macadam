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
          id="things.deleteConfirmation.heading"
          description="The text shown in the header of the Thing delete confirmation model"
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
            id="things.deleteConfirmation.cancelButton.text"
            description="The text for the cancel button of the Thing delete confirmation model"
            defaultMessage="Cancel"
          />
        </Button>
        <Button colorScheme="red" onClick={() => onConfirm()}>
          <FormattedMessage
            id="things.deleteConfirmation.confirmButton.text"
            description="The text for the confirmation button of the Thing delete confirmation model"
            defaultMessage="Yes, delete it"
          />
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
