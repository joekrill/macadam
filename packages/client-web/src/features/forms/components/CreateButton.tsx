import { Button, ButtonProps } from "@chakra-ui/react";
import { FaSave } from "react-icons/fa";
import { FormattedMessage } from "react-intl";

export interface CreateButtonProps extends ButtonProps {}

export const CreateButton = ({ children, ...props }: CreateButtonProps) => (
  <Button leftIcon={<FaSave />} type="submit" colorScheme="blue" {...props}>
    {children || (
      <FormattedMessage
        id="forms.createButton.text"
        description="The text to show for the 'Create' button used by forms across the app when creating an entity"
        defaultMessage="Create"
      />
    )}
  </Button>
);
