import { Button, ButtonProps } from "@chakra-ui/react";
import { FaBan } from "react-icons/fa";
import { FormattedMessage } from "react-intl";

export interface CancelButtonProps extends ButtonProps {}

export const CancelButton = ({ children, ...props }: CancelButtonProps) => (
  <Button
    // minWidth={{ base: "full", sm: "xs" }}
    leftIcon={<FaBan />}
    type="button"
    colorScheme="yellow"
    variant="outline"
    {...props}
  >
    {children || (
      <FormattedMessage id="forms.cancelButton.label" defaultMessage="Cancel" />
    )}
  </Button>
);
