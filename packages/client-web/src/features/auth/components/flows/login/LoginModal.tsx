import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react";
import { LogoutButton } from "../../LogoutButton/LogoutButton";
import { Login, LoginProps } from "./Login";

export type LoginModalProps = Omit<ModalProps, "children"> &
  LoginProps & {
    title?: string;
  };

export const LoginModal = ({
  aal,
  clientType,
  flowId,
  refresh,
  returnTo,
  title = "Login",
  ...props
}: LoginModalProps) => (
  <Modal {...props}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{title}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Login
          aal={aal}
          clientType={clientType}
          flowId={flowId}
          refresh={refresh}
          returnTo={returnTo}
        />
      </ModalBody>

      <ModalFooter>
        <LogoutButton>Cancel / Logout</LogoutButton>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
