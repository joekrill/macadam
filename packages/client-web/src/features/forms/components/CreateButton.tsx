import { Button, ButtonProps } from "@chakra-ui/react";
import { FaSave } from "react-icons/fa";
import { FormattedMessage } from "react-intl";

export interface CreateButtonProps extends ButtonProps {}

export const CreateButton = ({ children, ...props }: CreateButtonProps) => (
  <Button leftIcon={<FaSave />} type="submit" colorScheme="blue" {...props}>
    {children || (
      <FormattedMessage id="forms.createButton.label" defaultMessage="Create" />
    )}
  </Button>
);
