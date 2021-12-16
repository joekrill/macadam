import { Button, ButtonProps } from "@chakra-ui/react";
import { FaSave } from "react-icons/fa";
import { FormattedMessage } from "react-intl";

export interface SaveButtonProps extends ButtonProps {}

export const SaveButton = ({ children, ...props }: SaveButtonProps) => (
  <Button
    minWidth={{ base: "full", sm: "xs" }}
    leftIcon={<FaSave />}
    type="submit"
    colorScheme="blue"
    {...props}
  >
    {children || (
      <FormattedMessage id="forms.saveButton.label" defaultMessage="Save" />
    )}
  </Button>
);
